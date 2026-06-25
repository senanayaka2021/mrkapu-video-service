# MrKapu Video Service

Standalone Nest service for short-video APIs (and related service catalog helpers).

## Included slices

- `services` module
- short videos feed + upload endpoint
- S3 presigned upload helper (`POST /services/presign`)

## Expected environment variables

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `AWS_REGION`
- `AWS_S3_BUCKET`
- `AWS_S3_PUBLIC_URL`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `EVENT_BUS_NAME`

## Notes

- Uses the shared `auth_users` collection for actor lookups and ownership checks.
- Set `SERVICES_API_BASE_URL` in the mobile app to this service’s API Gateway URL.
