service: ddm-ui
runtime: nodejs14

vpc_access_connector:
  name: projects/_PROJECT_ID/locations/europe-west2/connectors/vpcconnect

env_variables:
  PROJECT_ID: _PROJECT_ID
  DATA_DELIVERY_STATUS_API: _DATA_DELIVERY_STATUS_API
  AZURE_AUTH_TOKEN: _AZURE_AUTH_TOKEN
  ENV_NAME: _ENV_NAME
  GIT_BRANCH: _GIT_BRANCH
  DATA_DELIVERY_AZURE_PIPELINE_NO: _DATA_DELIVERY_AZURE_PIPELINE_NO

basic_scaling:
  idle_timeout: 10m
  max_instances: 10

handlers:
- url: /.*
  script: auto
  secure: always
  redirect_http_response_code: 301
