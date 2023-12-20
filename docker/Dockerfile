FROM adrianmusante/pocketbase

COPY migrations /migrations
COPY html /html

ENV POCKETBASE_MIGRATION_DIR=/migrations
ENV POCKETBASE_PUBLIC_DIR=/html

EXPOSE 8090