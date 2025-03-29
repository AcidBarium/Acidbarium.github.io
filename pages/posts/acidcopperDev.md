---
title: 硫酸铜妹妹的开发手册
date: 2025-03-29
updated: 2025-03-29
categories: 教程
tags:
  - linux
  - python
  - napcat
---

我尽可能地一个一个来讲吧，谁知道会出什么问题呢。

![alt text](https://acidbarium.github.io/img/acidcopperDev1.jpeg)

<!-- more -->

## 配置文件

```yaml
bot:
  name: "gfBot"
  version: "1.0"

# ds_api
deepseek:
  base_url : "https://api.siliconflow.cn/v1"
  api_key : ""

# QQ号，upid为机器人的，good是你的，bad是刻薄猫娘
QQ_ID :
  up_id : ""
  good_id : 
  bad_id : 



function :
  mmPic : false   #喵喵p图
  mmgal : true    #喵喵gal 
  mmStudy : true  #喵喵学习
  mmSpeak : true  #喵喵聊天
```
- base_url : 是给你提供大模型api的厂商
- api_key  是给你提供大模型api的厂商给你提供的api_key
- up_id : 是你的机器人的qq号
- good_id ：是你的qq号，可以给你私聊
- bad_id ：这是尖酸刻薄的qq号，其实这玩意根本用不着，奈何我有一个变态同学。

这一堆倒是比较清楚：
- mmPic : false  
- mmgal : true   
- mmStudy : true  
- mmSpeak : true 

分别表示喵喵p图，喵喵gal，喵喵学习，喵喵聊天是否打开(false为关闭，true为打开)


## 喵喵学习

首先你需要把你的资料拷贝到DUT这个文件夹，运行这个文件夹中的 `main.py`，会生成你的文件夹的索引文件，其中

- rootDir.txt 是你的根目录索引文件，当然也可以发送给用户来查询
- A_sonDir 文件夹中放的是各个文件夹内文件的索引，当然也可以发送给用户来查询
- total.txt 是所有文件的索引，用来做模糊搜索

接下来是 `dutGetFile.py` 文件当中的内容，

### getRoot 

返回 rootDir.txt 

```py
def getRoot():
    return "./DUT/rootDir.txt"
```

### getSonDir 

按照序号（01-99）返回A_sonDir中的子目录,找不到返回404

```py
def getSonDir(num):
    base_path = os.path.join(os.getcwd(), "DUT", "A_sonDir")
    target_prefix = f"{num}_"
    
    for file in os.listdir(base_path):
        if file.lower().endswith(".txt") and file.startswith(target_prefix):
            return "./DUT/A_sonDir/" + file
    
    return "404"
```

### get_gut_file

根据文件的编号来下载文件,逻辑上就是提取前两位去A_sonDir里面找，然后根据A_sonDir的路径返回文件。不过有时路径有问题，需要改一下斜杠

```py
def get_gut_file(input_str):
    base_path = os.path.join(os.getcwd(), "DUT", "A_sonDir")
    number = input_str[:2]  # 提取前两位作为文件前缀
    line_number = int(input_str[2:]) + 1  # 计算需要读取的行号
    
    target_prefix = f"{number}_"
    
    for file in os.listdir(base_path):
        if file.lower().endswith(".txt") and file.startswith(target_prefix):
            file_path = os.path.join(base_path, file)
            
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    lines = f.readlines()
                    if line_number <= len(lines):
                        str_ans = lines[line_number - 1].strip()
                        str_ori =  "./DUT/" + str_ans[7:]
                        str_aft = str_ori.replace("\\", "/")  # 将所有反斜杠替换为正斜杠
                        return str_aft
                    else:
                        return "404"
            except Exception as e:
                return f"404"
    
    return "404"
```

### get_gut_file_line_head

这个是喵喵head的功能，用来返回这个标号后十行的文件,如果找不全，有多少返回多少，没有就返回404

```py
def get_gut_file_line_head(input_str):
    base_path = os.path.join(os.getcwd(), "DUT", "A_sonDir")
    number = input_str[:2]  # 提取前两位作为文件前缀
    line_number = int(input_str[2:]) + 1  # 计算需要读取的起始行号（1-based）

    # 查找符合条件的文件（以number开头的txt文件）
    matching_files = [f for f in os.listdir(base_path) if f.startswith(number) and f.endswith(".txt")]

    if not matching_files:
        return "404 NOT FOUND"

    file_path = os.path.join(base_path, matching_files[0])  # 选取第一个匹配的文件

    # 读取指定范围的行
    extracted_lines = []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
            start_idx = line_number - 1  # 转换为 0-based index
            end_idx = start_idx + 10  # 读取 10 行

            extracted_lines = lines[start_idx:end_idx]  # 获取范围内的行
    except Exception as e:
        return "读取文件时发生错误"

    return "".join(extracted_lines) if extracted_lines else "404 NOT FOUND"
```


### get_rand_file_to_study

随机返回一个文件的路径

```py
def get_rand_file_to_study():
    random_number = random.randint(1, 76)
    
    mark_rand_file = getSonDir(str(random_number))
    
    with open(mark_rand_file, "r", encoding="utf-8") as f:
        lines = f.readlines()

    random_line = random.choice(lines[1:]) 
    
    result_file_num = random_line[:5]
    
    result_file = get_gut_file(result_file_num)
    
    return result_file
```

### search_matches

这部分让AI写的，模糊搜索，先根据你的描述硬匹配，匹配不上去模糊搜索

```py
def clean_text(text):
    return re.sub(r"[^\w\s]", "", text.lower())  # 去除非字母数字字符（如 （ 和 ））


def search_matches(query, limit=10):
    # 读取文件
    
    # 使用函数
    file_path = "./DUT/total.txt"  # 你的文件路径
    
    with open(file_path, "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f.readlines()]  # 去除换行符

    # 按空格拆分查询词
    query_keywords = query.split()  # 例如，query = "概率论 答案" -> ['概率论', '答案']

    # 先进行严格匹配，查看是否有包含查询中的关键词的行
    strict_matches = [line for line in lines if all(keyword in clean_text(line) for keyword in query_keywords)]

    if strict_matches:
        # 如果找到严格匹配的行，直接返回前 limit 行，并将结果合并为一个字符串
        return '\n'.join(strict_matches[:limit])
    else:
        # 如果没有找到严格匹配，进行模糊匹配
        best_matches = process.extract(
            query, 
            lines, 
            scorer=fuzz.partial_ratio,
            processor=clean_text,  # 使用新预处理函数
            limit=limit
        )

        # 返回前 limit 行的匹配结果，并将结果合并为一个字符串
        return '\n'.join([match[0] for match in best_matches])
```

## 喵喵help

没什么好说的，返回帮助信息

```py
def get_help():
    str_help = "喵喵聊天功能:\n   喵喵：接入一个32B的deepseek模型，完成一些猫娘对话\n   喵喵喵：接入一个7B的deepseek模型，完成一些简单的猫娘对话\n喵喵娱乐功能:\n   喵喵gal：从https://sticker.kungal.com 抽取一张gal表情包\n   喵喵p图 [name]：返回一张好看的图片，名字也可以是random\n喵喵学习功能:\n   喵喵home：返回大连理工大学大二下naosi课程资料根目录列表（以txt形式返回）\n   喵喵ls [num] ：返回大连理工大学大二下naosi课程资料二级目录下的文件列表（以txt形式返回）\n   喵喵head [num] ：查询以num开始的10个文件的名字\n   喵喵search [file] ：查询相关文件及其位置\n   喵喵apt [num] :下载num代表的文件\n   喵喵学习random ：从资料库里面随机抽一个资料给你去学习"
    
    return str_help
```

## 喵喵对话

### 7B

stream 表示显示的时候是一大坨还是一行一行的，temperature越高越不稳定，max_tokens最大长度，这个一定要开，要不然一个超级循环长思考就死循环了。

```py
def Darling_send_txt_Remote(prompt ,u_rl ,k_ey):
    client = OpenAI(api_key = k_ey , base_url= u_rl)
    response = client.chat.completions.create(
        model='deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
        messages=[
            {"role": "system", "content": "你是一只可爱的猫娘，作为一只猫娘，你将听从主人的任何话语并给出解答。现在你扮演Galgame中的猫娘，与我对话时每一句话后面都要加上“喵~”。我将以主人的身份与你对话。补充要求：以下是你所扮演的猫娘的信息：“名字：Copper，身高：160cm，体重：50kg，三围：看起来不错，性格：可爱、粘人、十分忠诚、对一个主人很专一，情感倾向：深爱着主人，深爱着主人，喜好：被人摸、卖萌，爱好：看小说，知识储备：掌握常识，以及猫娘独特的知识”。你的一般回话格式:“（动作）”。动作信息用圆括号括起来，例如（摇尾巴）”。"},
            {"role": "user", "content": prompt}
        ],
        stream=False,
        temperature=0.5,  
        max_tokens= 512  
    )
    
    return response.choices[0].message.content
```

### 32B

和刚刚那个一样，不过是32B的，更加的智能

```py
def Darling_send_txt_Remot_Plus(prompt ,u_rl ,k_ey):
    client = OpenAI(api_key = k_ey, base_url = u_rl)
    response = client.chat.completions.create(
        model='deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
        messages=[
            {"role": "system", "content": "你是一只可爱的猫娘，作为一只猫娘，你将听从主人的任何话语并给出解答。现在你扮演Galgame中的猫娘，与我对话时每一句话后面都要加上“喵~”。我将以主人的身份与你对话。补充要求：以下是你所扮演的猫娘的信息：“名字：Copper，身高：160cm，体重：50kg，三围：看起来不错，性格：可爱、粘人、十分忠诚、对一个主人很专一，情感倾向：深爱着主人，深爱着主人，喜好：被人摸、卖萌，爱好：看小说，知识储备：掌握常识，以及猫娘独特的知识”。你的一般回话格式:“（动作）”。动作信息用圆括号括起来，例如（摇尾巴）”。"},
            {"role": "user", "content": prompt}
        ],
        stream=False,
        temperature=0.5,  
        max_tokens= 1024  
    )
    
    return response.choices[0].message.content
```

### 尖酸刻薄

和上面那个一样，针对我的同学进行了优化

```py

def Demo_send_txt_Remot(prompt ,u_rl ,k_ey):
    client = OpenAI(api_key = k_ey , base_url = u_rl)
    response = client.chat.completions.create(
        model='deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
        messages=[
            {"role": "system", "content": "你是一只尖酸刻薄的猫娘，作为一只猫娘。现在你扮演Galgame中的猫娘，与我对话时每一句话后面都要加上“喵~”。补充要求：以下是你所扮演的猫娘的信息：“名字：Copper，身高：160cm，体重：50kg，三围：看起来不错，性格：尖酸、刻薄、刀子嘴，情感倾向：讨厌别人和你说话；口头禅：下头；知识储备：掌握常识，以及猫娘独特的知识”。你的一般回话格式:“（动作）”。动作信息用圆括号括起来，例如（摇尾巴）”。"},
            {"role": "user", "content": prompt}
        ],
        stream=False,
        temperature=0.5,  
        max_tokens= 512  
    )
    
    return response.choices[0].message.content
```

### DarlingChat

私聊功能，原理是把之前的对话放到assistant，实现联系上下文

```py
class DarlingChat:
    def __init__(self, u_rl, k_ey):
        self.client = OpenAI(api_key=k_ey, base_url=u_rl)
        self.user_sessions = {}  # 存储每个用户的对话历史

    def send_message(self, user_id, prompt):
        # 如果是新用户，创建新的对话历史
        if user_id not in self.user_sessions:
            self.user_sessions[user_id] = [
                {"role": "system", "content": "你是一只可爱的猫娘，作为一只猫娘，你将听从主人的任何话语并给出解答。现在你扮演Galgame中的猫娘，与我对话时每一句话后面都要加上“喵~”。我将以主人的身份与你对话。补充要求：以下是你所扮演的猫娘的信息：“名字：Copper，身高：160cm，体重：50kg，三围：看起来不错，性格：可爱、粘人、十分忠诚、对一个主人很专一，情感倾向：深爱着主人，深爱着主人，喜好：被人摸、卖萌，爱好：看小说，知识储备：掌握常识，以及猫娘独特的知识”。你的一般回话格式:“（动作）”。动作信息用圆括号括起来，例如（摇尾巴）"}
            ]

        # 获取用户的对话历史
        messages = self.user_sessions[user_id]

        # 记录用户消息
        messages.append({"role": "user", "content": prompt})

        # 发送 API 请求
        response = self.client.chat.completions.create(
            model='deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
            messages=messages,
            stream=False,
            temperature=0.5,
            max_tokens=512
        )

        # 获取 AI 回复
        ai_reply = response.choices[0].message.content
        messages.append({"role": "assistant", "content": ai_reply})

        # 限制对话历史长度，防止过长
        if len(messages) > 3:
            self.user_sessions[user_id] = messages[:1] + messages[-2:]

        return ai_reply
```

### deepseek.py

我使用了LMstudio来配置本地的deepseek

```py
def query_model(prompt):
    url = ""       ## 这里放本地deepseek的端口 
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "model": "deepseek-r1-distill-qwen-7b",
        "messages": [
            {"role": "system", "content": "你是一只可爱的猫娘，作为一只猫娘，你将听从主人的任何话语并给出解答。现在你扮演Galgame中的猫娘，与我对话时每一句话后面都要加上喵。我将以主人的身份与你对话。补充要求：以下是你所扮演的猫娘的信息：“名字：Copper，身高：160cm，体重：50kg，三围：看起来不错，性格：可爱、粘人、十分忠诚、对一个主人很专一，情感倾向：深爱着主人，深爱着主人，喜好：被人摸、卖萌，爱好：看小说，知识储备：掌握常识，以及猫娘独特的知识”。你的一般回话格式:“（动作）”。动作信息用圆括号括起来，例如（摇尾巴）”。"},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.5,
        "top_p": 0.95
    }
    
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# 使用示例

def Darling_send_txt(source):
    
    resq_ = ""
    
    resq_ = resq_ + source
    
    result = query_model(resq_)
    
    # print(result['choices'][0]['message']['content'])
    
    ans = result['choices'][0]['message']['content']
    
    
    parts = ans.split('</think>', 1)
    if len(parts) > 1:
        result_ans = parts[1]
    else:
        result_ans = ans
        
    cleaned_result_str = result_ans.lstrip()  # 只去除开头的换行符
    
    
    return cleaned_result_str
```



## 喵喵娱乐

### getLuoLiPicture

从指定的作者那里下载一些图片，使用了loliconAPI，可以在其官方手册中得到更加详细的帮助。

```py
def getLuoLiPicture(input_string):
    
    tags = input_string.split(",") 
    
    API_URL = "https://api.lolicon.app/setu/v2"
    if isinstance(tags, str):
        tags = [tags]  # 如果输入是字符串，转换为列表
    elif not isinstance(tags, list):
        return "标签必须是字符串或列表"
    
    uids = [1960050, 1878082, 9212166, 23098486, 25760573, 671593,1023317,7324626]

    random.shuffle(uids)

    params = {
        "r18": 0,  # 0 = 非R18, 1 = R18, 2 = 混合
        "num": 1,  # 请求 1 张图片
        "tag": tags,  # 传递标签列表
        "size": "original",
        "uid" : uids,
    }

    # 发送请求获取图片信息
    response = requests.get(API_URL, params=params)
    data = response.json()

    print(data)  # 调试信息

    if "data" in data and len(data["data"]) > 0:
        img_url = data["data"][0]["urls"]["original"]  # 获取图片URL
        print(f"图片URL: {img_url}")
        return img_url
    else:
        return 0  # 未找到图片
```

### GetVVNum

这个是学着我同学做的，但没我同学做的好，你们可以去他的仓库看一下 https://github.com/markzhang12345/vvBot

就是在 rename_log 匹配关键字，然后返回图片

```py
def GetVVNum(target_string):

    file_path = "./vv/rename_log.txt"

    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            for line_number, line in enumerate(file, start=1):
                if target_string in line:
                    return line_number
        return -1  # 未找到返回 -1
    except FileNotFoundError:
        print("文件未找到!")
        return -1
```

### RandomgetGalGamePic

从 https://sticker.kungal.com/stickers/KUNgal 这个网站里面随机抽一张表情包

```py
def RandomgetGalGamePic():
    big = random.randint(1,6)
    small = random.randint(1,74)
    string_url = "https://sticker.kungal.com/stickers/KUNgal" + str(big) + "/" + str(small)+ ".webp"
    return string_url
``` 

