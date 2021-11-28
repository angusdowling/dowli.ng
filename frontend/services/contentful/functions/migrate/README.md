# Migration Script

## Introduction

Data models will be managed via JSON, not the web interface. This gives us:

- Easy management
- Version control
- Simple upstream migration

To facilitate this design decision, this migration script was developed to sync JSON data models with those in contentful.

## Usage

The following environment variables are required to run the migration script:

- CONTENTFUL_MANAGEMENT_ACCESS_TOKEN
- CONTENTFUL_SPACE_ID
- CONTENTFUL_ENV

CONTENTFUL_MANAGEMENT_ACCESS_TOKEN and CONTENTFUL_SPACE_ID are sensitive and should be specified in a .env file.

CONTENTFUL_ENV is not and can be defined in a CLI command that runs the script.
