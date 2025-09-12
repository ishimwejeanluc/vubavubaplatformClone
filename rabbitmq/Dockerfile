FROM rabbitmq:4-management

# Create the RabbitMQ data directory and set up the erlang cookie with proper permissions
ARG COOKIE_VALUE=dev-cookie-12345678
RUN set -eux; \
    mkdir -p /var/lib/rabbitmq; \
    echo "${COOKIE_VALUE}" > /var/lib/rabbitmq/.erlang.cookie; \
    chmod 400 /var/lib/rabbitmq/.erlang.cookie; \
    chown -R rabbitmq:rabbitmq /var/lib/rabbitmq

# Switch to rabbitmq user
USER rabbitmq
