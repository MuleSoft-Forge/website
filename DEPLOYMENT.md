# Deployment Guide

This document provides comprehensive deployment documentation for the MuleSoft Forge documentation website.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Environments](#environments)
- [Deployment Flow](#deployment-flow)
- [Deploying to Production](#deploying-to-production)
- [Approving Deployments](#approving-deployments)
- [Rollback Procedures](#rollback-procedures)
- [Monitoring & Verification](#monitoring--verification)
- [Troubleshooting](#troubleshooting)

---

## Overview

The MuleSoft Forge documentation website uses a **multi-environment deployment pipeline** with automated staging deployments and controlled production deployments requiring approval.

**Key Features**:
- ✅ Automatic staging deployments on merge to `main`
- ✅ Manual production deployments with approval workflow
- ✅ PR previews for every pull request
- ✅ Slack notifications for all deployment events
- ✅ Full audit trail via GitHub Actions

---

## Architecture

### Deployment Pipeline

```
Developer → Pull Request → PR Preview (automatic)
                ↓ (merge)
            main branch → Staging (automatic)
                ↓ (manual trigger)
            Production Workflow → Approval Required
                ↓ (approved)
            Production Deployment
```

### Infrastructure

**Hosting**: Cloudflare Pages
**CI/CD**: GitHub Actions
**Approval**: GitHub Environments

**Cloudflare Projects**:
- `mulesoftforge-staging` - Staging environment
- `mulesoftforge` - Production environment

**GitHub Workflows**:
- `.github/workflows/preview-pr.yml` - PR preview deployments
- `.github/workflows/deploy.yml` - Staging deployments
- `.github/workflows/deploy-production.yml` - Production deployments

---

## Environments

### Production

**URL**: https://mulesoftforge.pages.dev (default)
**Custom Domains**:
- https://mulesoftforge.com (when configured)
- https://www.mulesoftforge.com (when configured)

**Deployment Method**: Manual trigger with approval required
**Approvers**: Ryan Hoegg, George Jeffcock, Ryan Carter, Matthias Transier (any one can approve)
**Purpose**: Live site serving end users

### Staging

**URL**: https://mulesoftforge.nonprod.app (custom domain)
**Alternate URL**: https://mulesoftforge-staging.pages.dev (default)

**Deployment Method**: Automatic on merge to `main`
**Purpose**: Testing and validation before production deployment

### PR Previews

**URL Pattern**: `https://pr-{number}.mulesoftforge-staging.pages.dev`
**Example**: `https://pr-42.mulesoftforge-staging.pages.dev`

**Deployment Method**: Automatic on PR creation/update
**Purpose**: Review changes before merging

---

## Deployment Flow

### 1. Development & PR Preview

```bash
# Create feature branch
git checkout -b feature/my-changes

# Make changes, commit
git add .
git commit -m "Add new connector documentation"

# Push and create PR
git push origin feature/my-changes
```

**Result**: PR preview automatically deployed to `https://pr-{number}.mulesoftforge-staging.pages.dev`

### 2. Staging Deployment

```bash
# Merge PR to main (via GitHub UI)
```

**Result**: Staging automatically deploys to https://mulesoftforge.nonprod.app

**Verification**:
- Check Slack #website channel for deployment notification
- Visit staging URL and verify changes
- Test functionality in staging environment

### 3. Production Deployment

**Only proceed after**:
- ✅ Changes verified in staging
- ✅ All tests passing
- ✅ Content reviewed and approved
- ✅ No critical issues identified

See [Deploying to Production](#deploying-to-production) below for detailed steps.

---

## Deploying to Production

### Prerequisites

**Required Permissions**:
- Write access to the GitHub repository (to trigger workflow)
- One of the designated approvers must be available

**Designated Approvers**:
- Ryan Hoegg
- George Jeffcock
- Ryan Carter
- Matthias Transier

### Step-by-Step Process

#### Step 1: Trigger Deployment

1. Go to **GitHub Actions**: https://github.com/MuleSoft-Forge/website/actions
2. Click **"Deploy to Production"** in the left sidebar
3. Click the **"Run workflow"** button (top right)
4. Fill in the form:
   - **Use workflow from**: `main` (should be pre-selected)
   - **Reason for deployment** (optional but recommended):
     - Example: "Deploy new IDP connector documentation"
     - Example: "Fix broken links in vectors connector page"
     - Example: "Monthly content update"
5. Click **"Run workflow"** to start the deployment

#### Step 2: Monitor Build

The workflow will:
1. ✅ Checkout code from `main` branch
2. ✅ Setup Node.js 20
3. ✅ Install dependencies (`npm ci`)
4. ✅ Build VitePress site (`npm run docs:build`)
5. ✅ Upload build artifact
6. ⏸️ **Pause and wait for approval**

**Expected Duration**: Build takes ~2-3 minutes

#### Step 3: Wait for Approval

After the build completes, the workflow will pause at the deployment step.

**What happens**:
- GitHub sends notifications to all designated approvers
- Workflow shows "Waiting for approval" status
- Deployment will not proceed until approved

**Notifying Approvers**:
- Approvers receive GitHub notification automatically
- You can also ping them in Slack #website channel
- Include the workflow run URL for quick access

#### Step 4: Approval Process

See [Approving Deployments](#approving-deployments) section below.

#### Step 5: Deployment Completes

After approval:
1. ✅ Downloads build artifact
2. ✅ Deploys to Cloudflare Pages project `mulesoftforge`
3. ✅ Sends Slack notification to #website channel

**Expected Duration**: Deployment takes ~1-2 minutes

#### Step 6: Verify Production

1. Visit https://mulesoftforge.pages.dev
2. Verify your changes are live
3. Check browser console for errors
4. Test key functionality
5. Confirm Slack notification was received

---

## Approving Deployments

### For Approvers

If you're one of the designated approvers (Ryan Hoegg, George Jeffcock, Ryan Carter, or Matthias Transier):

#### Step 1: Receive Notification

You'll receive a GitHub notification when approval is needed:
- Email notification (if enabled)
- GitHub web notification (bell icon)
- Direct link to the workflow run

#### Step 2: Review Deployment Request

1. Click the notification to go to the workflow run
2. Review the deployment details:
   - **Who triggered**: Check the deployer's username
   - **Branch**: Should be `main`
   - **Reason**: Read the deployment reason if provided
   - **Changes**: Review recent commits to `main`

3. Click **"Review deployments"** button

#### Step 3: Make Decision

**Before approving, verify**:
- ✅ Changes were tested in staging
- ✅ Deployment reason makes sense
- ✅ No emergency stop requests in Slack
- ✅ Deployer is a known team member

**Approval Options**:
- ✅ **Approve and deploy** - Proceed with deployment
- ❌ **Reject** - Cancel deployment and provide reason

#### Step 4: Approve or Reject

**To Approve**:
1. Select **"Approve and deploy"**
2. Optionally add a comment
3. Click **"Approve deployment"**

**To Reject**:
1. Select **"Reject"**
2. **Must add a comment** explaining why (e.g., "Staging not verified", "Critical bug found")
3. Click **"Reject deployment"**

#### Step 5: Monitor Completion

After approval:
- Workflow continues automatically
- You'll see "Deployment approved" status
- Check Slack #website for success notification

**If rejected**:
- Workflow stops immediately
- Deployer is notified
- No changes are made to production

---

## Rollback Procedures

### Option 1: Revert and Redeploy (Recommended)

**Use when**: You need to undo recent changes

```bash
# Find the commit to revert
git log --oneline

# Revert the problematic commit
git revert <commit-sha>

# Push to main
git push origin main
```

**Result**:
- Staging auto-deploys with reverted changes
- Verify in staging
- Deploy to production using normal process

**Advantages**: Clean git history, proper audit trail

### Option 2: Deploy Previous Version

**Use when**: You need to quickly restore a known-good version

1. Go to GitHub Actions > Deploy to Production
2. Click "Run workflow"
3. **Important**: Change "Use workflow from" to the previous good commit SHA
4. Add reason: "Rollback to version before incident"
5. Complete approval process

**Advantages**: Fast rollback without code changes

### Option 3: Manual Cloudflare Rollback

**Use when**: Emergency rollback needed immediately

**⚠️ Warning**: Only use in emergency. Bypasses normal process.

1. Log in to Cloudflare Dashboard
2. Go to Pages > mulesoftforge project
3. Click "Deployments" tab
4. Find the last known-good deployment
5. Click "..." menu > "Rollback to this deployment"
6. Confirm rollback

**After emergency rollback**:
- Notify team in Slack #website
- Align git `main` branch with rolled-back version
- Follow normal deployment process to stabilize

---

## Monitoring & Verification

### Post-Deployment Checklist

After every production deployment:

- [ ] **Site loads**: Visit https://mulesoftforge.pages.dev
- [ ] **No console errors**: Open browser DevTools console
- [ ] **Navigation works**: Click through main navigation
- [ ] **Search works**: Try searching for content
- [ ] **Images load**: Check key pages with images
- [ ] **Links work**: Verify internal and external links
- [ ] **Slack notification**: Confirm notification received in #website

### Health Checks

**Daily**:
- Site is accessible
- No browser console errors

**Weekly**:
- All connector pages load correctly
- Search index is up to date
- No broken internal links

**Monthly**:
- Review Cloudflare analytics
- Check page load performance
- Review and address any issues

### Monitoring Tools

**Cloudflare Dashboard**: https://dash.cloudflare.com
- View deployment history
- Check traffic analytics
- Monitor performance metrics

**GitHub Actions**: https://github.com/MuleSoft-Forge/website/actions
- View deployment logs
- Check workflow status
- Review deployment history

**Slack #website Channel**:
- Real-time deployment notifications
- Team communication
- Issue alerts

---

## Troubleshooting

### Deployment Fails: Build Errors

**Symptom**: Workflow fails during "Build VitePress site" step

**Common Causes**:
- Syntax error in markdown
- Missing image reference
- Invalid frontmatter
- Broken component usage

**Solution**:
1. Check the workflow logs for specific error
2. Fix the issue in a new PR
3. Verify fix in staging before production deployment

### Deployment Fails: Authentication Error

**Symptom**: "Authentication failed" error during Cloudflare deployment

**Causes**:
- Expired `CLOUDFLARE_API_TOKEN`
- Invalid `CLOUDFLARE_ACCOUNT_ID`

**Solution**:
1. Verify secrets in GitHub repository settings
2. Regenerate Cloudflare API token if needed
3. Update GitHub secrets
4. Retry deployment

### Approval Not Appearing

**Symptom**: Workflow runs but no approval request appears

**Causes**:
- GitHub Environment not configured correctly
- Workflow doesn't use `environment: production`

**Solution**:
1. Check `.github/workflows/deploy-production.yml` has `environment: production` in deploy job
2. Verify GitHub Environment "production" exists with approvers configured
3. Re-run workflow

### Site Not Updating After Deployment

**Symptom**: Deployment succeeds but site shows old content

**Causes**:
- Browser cache
- CDN cache
- DNS propagation (custom domains only)

**Solution**:
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Try incognito/private browsing mode
3. Check different browser
4. Wait 5-10 minutes for CDN propagation
5. Verify correct Cloudflare project was deployed to

### Slack Notifications Not Received

**Symptom**: Deployment succeeds but no Slack notification

**Causes**:
- Invalid `SLACK_WEBHOOK_URL`
- Webhook expired or revoked

**Solution**:
1. Check workflow logs for Slack step errors
2. Regenerate Slack webhook if needed
3. Update `SLACK_WEBHOOK_URL` secret in GitHub
4. Notifications are non-blocking; deployment still succeeds

### Emergency: Site is Down

**Immediate Actions**:
1. Check Cloudflare status: https://www.cloudflarestatus.com
2. Verify DNS records in Cloudflare dashboard
3. Check recent deployments in Cloudflare Pages
4. Rollback to last known-good deployment (see [Rollback Procedures](#rollback-procedures))

**Communication**:
1. Alert team in Slack #website
2. Post status update
3. Coordinate response

**Post-Incident**:
1. Document what happened
2. Identify root cause
3. Implement preventive measures
4. Update runbooks if needed

---

## Best Practices

### Deployment Timing

**Best Times**:
- Mid-week (Tuesday-Thursday)
- Morning or early afternoon (EST)
- Avoid Friday deployments (unless urgent)
- Avoid late evening/weekend (unless emergency)

**Why**: Ensures team availability for monitoring and quick response if issues arise.

### Testing Before Production

**Always**:
- ✅ Verify changes in staging first
- ✅ Test in multiple browsers if making theme changes
- ✅ Check mobile responsiveness for layout changes
- ✅ Validate all links and images

**Never**:
- ❌ Deploy to production without staging verification
- ❌ Rush deployments without proper testing
- ❌ Deploy breaking changes without team awareness

### Communication

**Before Deployment**:
- Announce major deployments in Slack #website
- Coordinate timing with team
- Ensure approver availability

**During Deployment**:
- Monitor deployment progress
- Be available for questions
- Watch for error notifications

**After Deployment**:
- Confirm success in Slack
- Verify deployment live
- Monitor for issues

---

## Getting Help

**Questions about deployment process**:
- Check this guide first
- Ask in Slack #website channel
- Create GitHub issue for documentation improvements

**Deployment issues**:
- Check [Troubleshooting](#troubleshooting) section
- Review workflow logs in GitHub Actions
- Contact designated approvers for urgent issues

**Infrastructure changes**:
- Discuss in Slack #website first
- Create proposal issue
- Get team consensus before implementing

---

## Appendix

### Deployment Workflow Files

**Production Deployment**: `.github/workflows/deploy-production.yml`
```yaml
- Manual trigger (workflow_dispatch)
- Environment: production (requires approval)
- Deploys to: mulesoftforge Cloudflare project
```

**Staging Deployment**: `.github/workflows/deploy.yml`
```yaml
- Auto-trigger on push to main
- No approval required
- Deploys to: mulesoftforge-staging Cloudflare project
```

**PR Previews**: `.github/workflows/preview-pr.yml`
```yaml
- Auto-trigger on PR open/update
- Deploys to: mulesoftforge-staging project (branch: pr-{number})
- Adds comment to PR with preview URL
```

### GitHub Secrets & Variables

**Required Secrets** (configured in repository settings):
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with Pages write access
- `SLACK_WEBHOOK_URL` - Slack webhook for #website channel
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions

**Required Variables**:
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID

### Useful Links

- **Production Site**: https://mulesoftforge.pages.dev
- **Staging Site**: https://mulesoftforge.nonprod.app
- **GitHub Repository**: https://github.com/MuleSoft-Forge/website
- **GitHub Actions**: https://github.com/MuleSoft-Forge/website/actions
- **Cloudflare Dashboard**: https://dash.cloudflare.com

---

**Last Updated**: 2026-02-02
**Document Version**: 1.0
**Maintained By**: MuleSoft Forge Team
