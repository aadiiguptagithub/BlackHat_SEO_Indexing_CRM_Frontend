// Adapters to transform backend data shapes to UI models

export function adaptWebsite(website) {
  return {
    id: website._id,
    url: website.url,
    host: website.host,
    labels: website.labels || [],
    createdAt: website.createdAt
  };
}

export function adaptJob(job) {
  return {
    id: job._id,
    name: job.name,
    status: job.status,
    messageTemplate: job.messageTemplate,
    fields: job.fields || {},
    counts: job.counts || {
      total: 0,
      pending: 0,
      running: 0,
      success: 0,
      failed: 0
    },
    createdAt: job.createdAt
  };
}

export function adaptSubmission(submission) {
  return {
    id: submission._id,
    jobId: submission.jobId,
    websiteUrl: submission.websiteId?.url || '',
    websiteId: submission.websiteId?._id || submission.websiteId,
    status: submission.status,
    attempt: submission.attempt || 0,
    error: submission.error || null,
    evidence: submission.evidence || {},
    logs: submission.logs || [],
    createdAt: submission.createdAt,
    updatedAt: submission.updatedAt
  };
}

export function adaptMetrics(metrics) {
  return {
    totals: metrics.totals || {},
    today: metrics.today || {},
    jobs: metrics.jobs || {}
  };
}

export function adaptPagination(pagination) {
  return {
    page: pagination.page || 1,
    limit: pagination.limit || 10,
    total: pagination.total || 0,
    totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 10))
  };
}