---
title: "软件工程是非常有用的一门课"
date: 2025-10-02 15:51:43
updated: 2025-10-02 15:51:43
tags:
  - 软件工程
  - CICD
categories:
  - 随笔
aplayer: true
---

## 一、CI/CD 的概念

* **CI (Continuous Integration，持续集成)**
  指的是开发人员频繁地将代码集成到主分支（如 `main` 或 `develop`），并通过自动化的构建、测试来验证每次集成是否正常。
  **目标**：尽早发现问题、避免集成地狱、提高代码质量。

* **CD (Continuous Delivery / Continuous Deployment，持续交付/持续部署)**

  * **持续交付**：在 CI 基础上，保证代码始终处于可随时发布的状态。
  * **持续部署**：在持续交付的基础上，自动将代码部署到生产环境。
    **目标**：缩短交付周期，实现快速、安全的上线。

简单来说：
**CI = 自动化测试+构建**
**CD = 自动化发布+部署**


## 二、GitHub Actions 是什么

* **GitHub Actions** 是 GitHub 提供的 **CI/CD 平台**，允许你在 GitHub 仓库中定义自动化流程（workflow）。
* 它的配置基于 **YAML 文件**，通常放在 `.github/workflows/` 目录下。
* 触发方式多样：代码提交（push）、Pull Request、定时任务（cron）、Issue 评论、甚至外部事件（webhook）。
* 工作流由 **jobs**（任务）组成，每个任务可以在不同环境（如 Linux、Windows、macOS）中运行。

简而言之：
👉 **CI/CD 是软件工程实践，而 GitHub Actions 是实现 CI/CD 的一个具体工具。**


## 三、GitHub Actions 的优点

1. **与 GitHub 深度集成**

   * 无需额外安装 CI 服务器（如 Jenkins），代码提交即触发。
   * 支持 PR 检查、代码审查、自动评论、自动合并等 GitHub 原生操作。

2. **使用简单**

   * YAML 文件描述清晰，学习成本相对低。
   * 有大量现成的 **Actions（插件/步骤模块）**，可以直接复用，比如部署到 AWS、Docker 构建、Lint 校验等。

3. **跨平台支持**

   * 官方提供的 runner（执行环境）涵盖 Linux、macOS、Windows。
   * 可以运行在 GitHub 提供的虚拟机上，也可以使用 **自托管 runner**（自定义服务器）。

4. **生态丰富**

   * 社区维护了大量 actions，可以直接拿来用。
   * Marketplace 中能找到各种构建、部署、通知等模块。

5. **性价比高**

   * 公共仓库免费无限使用。
   * 私有仓库也有免费额度（通常是 2000 分钟/月）。


## 四、GitHub Actions 的缺点

1. **性能和速度限制**

   * GitHub 提供的免费 runner 性能有限（CPU/内存规格不高）。
   * 构建时间长，且有并发和总运行时间限制。

2. **锁定在 GitHub 平台**

   * 强依赖 GitHub，如果团队的代码不在 GitHub 上，就无法使用。
   * 对比 Jenkins、GitLab CI/CD，灵活性和独立性略逊。

3. **成本问题（大规模使用时）**

   * 公共仓库免费，但私有仓库在超过免费额度后会产生费用。
   * 如果团队有大量项目、测试流程复杂，可能需要额外购买 CI/CD 服务或自建 runner。

4. **复杂流程管理不够灵活**

   * 虽然可以用 `matrix` 并行任务，但在处理特别复杂的流水线（如企业级多阶段审批、跨项目依赖）时，GitHub Actions 的表达能力比 Jenkins、Argo CD 等弱。

5. **调试体验一般**

   * 日志虽然能看，但本地调试不方便。
   * 需要借助第三方工具（如 `act`）才能在本地模拟运行。


## 五、总结

* **关系**：

  * CI/CD 是一种开发运维实践。
  * GitHub Actions 是 GitHub 提供的 CI/CD 实现工具。
* **适合场景**：

  * 中小型项目，代码托管在 GitHub，追求敏捷开发和快速交付。
  * 开源项目：免费、方便、与 GitHub 无缝集成。
* **不太适合**：

  * 大规模企业级复杂流水线需求（更推荐 Jenkins、GitLab CI/CD、Tekton、Argo CD 等）。
  * 对性能、资源消耗有严格要求的情况（建议用自建 runner 或混合方案）。

