docker exec cap-editor_redis_1 sh -c 'redis-cli KEYS 'alerts:*' | xargs redis-cli DEL'
