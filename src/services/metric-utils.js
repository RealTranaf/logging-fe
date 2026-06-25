import { metrics } from '@opentelemetry/api'

const meter = metrics.getMeter('react-fe')

export const gameSearchCounter = meter.createCounter(
    'game_search_total',
    {
        description: 'Số lần request tìm kiếm game',
    },
)

export const gameAddCounter = meter.createCounter(
    'game_add_total',
    {
        description: 'Số lần thêm game',
    },
)

export const gameUpdateCounter = meter.createCounter(
    'game_update_total',
    {
        description: 'Số lần cập nhật game.',
    },
)

export const gameDeleteCounter = meter.createCounter(
    'game_delete_total',
    {
        description: 'Số lần xóa game.',
    },
)

export const errorCounter = meter.createCounter(
    'frontend_errors_total',
    {
        description: 'Lỗi frontend',
    },
)

// Histogram
export const requestDuration = meter.createHistogram('http.client.request.duration', {
    description: 'Duration of HTTP requests',
    unit: 's'
})
