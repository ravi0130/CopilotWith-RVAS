# Data Provenance

## Purpose

This repository is a customer demonstration accelerator. It combines repository-grounded CopilotWith examples with clearly marked illustrative replay. It must not be presented as a live customer assessment.

## Repository-grounded content

The PolicyHub mission is adapted from `01-modernisation/sample-output/contoso-insurance/` in the CopilotWith repository, especially the discovery report, target architecture, intelligent migration plan, pricing-engine implementation slice, and test strategy.

Grounded facts include:

- .NET Framework 4.8 and an approximately 15-year-old application
- 47 projects and approximately 380K lines of code
- ASP.NET WebForms and MVC 5
- Four WCF services and three Windows Services
- SQL Server 2017 and SSRS
- TeamCity and Octopus Deploy
- Windows Server 2019 and IIS 10 hosting
- Proposed modern .NET services on Azure Container Apps
- Proposed Azure Service Bus and Blob Storage patterns
- Bounded migration phases with explicit go/no-go gates

The CopilotWith operating model also grounds specialist roles, explicit control boundaries, human stage gates, evidence classification, and the rule that agents do not merge pull requests, push to production, approve risk, or accept policy exceptions.

## Illustrative replay

The following are demo devices rather than measured customer results:

- The topology coordinates and timed X-Ray scan
- The exact blocker count and affected-file counts where no source report states them
- Plan effort estimates, readiness scores, generated code diff, test output, image build, and PR number
- Before/after operational metrics
- The 127-application portfolio and generated waves
- eShop and "Your application" launch-card behavior

The UI labels the mission as Story Mode, calls proof an illustrative replay, and labels projected outcomes.

## Presenter rules

1. Say "repository-grounded sample" or "illustrative replay," never "live scan."
2. Do not attribute projected metrics to a customer.
3. Preserve confidence and decision classifications.
4. Keep human approval visible and consequential.
5. Use Connected Mode language only when a real repository adapter is active.

## Customer-data requirements

Before enabling Connected Mode, define data ownership, retention, redaction, identity, access control, regional storage, and evidence citation requirements. Every finding should retain its source, collection time, producing agent, confidence classification, and review state.
