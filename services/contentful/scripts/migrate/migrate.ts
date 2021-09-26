import {
  ContentFields,
  ContentType,
  CreateContentTypeProps,
  Environment,
  Space,
  KeyValueMap
} from "contentful-management/dist/typings/export-types"
import { config } from "dotenv"
import contentful from "contentful-management"
import pageModel from "../../models/page.json"
import seoModel from "../../models/seo.json"
import standardPageModel from "../../models/standardPage.json"
import blogArticlePageModel from "../../models/blogArticlePage.json"
import { CreateOrUpdateContentTypeInterface } from "./migrate.types"
import { CustomContentType } from "../../types/model.types"

config()

const migrate = () => {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!
  })

  /**
   * Gets an environment.
   *
   * @param environmentId - Environment ID.
   * @param space - Space.
   * @return Promise for an Environment.
   */
  const getEnvironment =
    (environmentId: string) =>
    async (space: Space): Promise<Environment> => {
      return space.getEnvironment(environmentId)
    }

  /**
   * Creates a Content Type with a custom ID.
   *
   * @param contentTypeId - Content type ID.
   * @param data - Data model of new content type.
   * @param environment - Environment.
   * @return Promise for the newly created Content Type.
   */
  const createContentTypeWithId =
    (contentTypeId: string, data: CreateContentTypeProps) =>
    async (environment: Environment): Promise<ContentType> => {
      return environment.createContentTypeWithId(contentTypeId, data)
    }

  /**
   * Gets a collection of Content Types.
   *
   * @param contentTypeId - Content type ID of the content type to return.
   * @param environment - Environment.
   * @returns Promise for a collection of Content Types.
   */
  const getContentType =
    (contentTypeId: string) =>
    async (environment: Environment): Promise<ContentType> => {
      return environment.getContentType(contentTypeId)
    }

  /**
   * Gets a Content Type field by ID.
   *
   * @param id - Field ID.
   */
  const getFieldById = (
    contentType: ContentType,
    id: string
  ): ContentFields<KeyValueMap> | undefined => {
    return contentType.fields.find((i) => i.id === id)
  }

  /**
   * Omits a Content Type field by index.
   *
   * @param contentType - Content type to update.
   * @param index - Index of field.
   */
  const omitFieldByIndex = (contentType: ContentType, index: number) => {
    contentType.fields[index].disabled = true
    contentType.fields[index].omitted = true
  }

  /**
   * Deletes a Content Type field by index.
   *
   * @param contentType - Content type to update.
   * @param index - Index of field.
   */
  const deleteFieldByIndex = async (
    contentType: ContentType,
    index: number
  ) => {
    contentType.fields[index].deleted = true
  }

  /**
   * Delete fields that no longer exist in the JSON file.
   *
   * @param data - New content type data model.
   * @param contentType - Content type to update.
   */
  const omitAndDeleteUnmatchedFields = async (
    data: ContentType,
    contentType: ContentType
  ) => {
    // Omit fields
    contentType.fields.map((field, index) => {
      if (!getFieldById(data, field.id)) {
        omitFieldByIndex(contentType, index)
      }
    })

    const updatedContentType = await contentType.update()
    const publishedContentType = await updatedContentType.publish()

    // Delete fields
    publishedContentType.fields.map((field, index) => {
      if (!getFieldById(data, field.id)) {
        deleteFieldByIndex(publishedContentType, index)
      }
    })

    return publishedContentType
  }

  /**
   * Update fields.
   *
   * @param data - New content type data model.
   * @param contentType - Content type to update.
   */
  const updateFields = (
    data: Record<any, any>,
    contentType: Record<any, any>
  ): void => {
    for (const key in data) {
      contentType[key] = data[key]
    }
  }

  /**
   * Sends an update to the server with any changes made to the object's properties.
   *
   * @param data - New content type data model.
   * @param contentType - Content type to update.
   * @returns Object returned from the server with updated changes.
   */
  const updateContentTypeModel =
    (data: ContentType) => async (contentType: ContentType) => {
      const updatedContentType = await omitAndDeleteUnmatchedFields(
        data,
        contentType
      )

      updateFields(data, updatedContentType)
      return updatedContentType.update()
    }

  /**
   * Handle success.
   *
   * @param contentType - Updated or newly created content type.
   */
  const handleSuccess = (contentType: ContentType) => {
    console.log(`Content type ${contentType.sys.id} successfully updated.`)
  }

  /**
   * Handle error.
   *
   * @param error - Error response.
   */
  const handleError =
    (options: CreateOrUpdateContentTypeInterface) => (error: any) => {
      const parsedError = JSON.parse(error.message)
      // If the content type wasn't found, lets create it.
      if (options.action === "update" && parsedError.status === 404) {
        console.log(`Content type not found, creating..`)
        createOrUpdateContentType({
          ...options,
          action: "create"
        })
      } else {
        console.error(error)
      }
    }

  /**
   * Update content type.
   *
   * @param options - Options specifying keys to connect to space,
   * which environment, and what data to replace.
   */
  const updateContentType = async (
    options: CreateOrUpdateContentTypeInterface
  ) => {
    return client
      .getSpace(options.spaceId)
      .then(getEnvironment(options.environmentId))
      .then(getContentType(options.contentTypeId))
      .then(updateContentTypeModel(options.data as ContentType))
      .then(handleSuccess)
      .catch(handleError(options))
  }

  /**
   * Create or update content type.
   *
   * @param options - Options specifying keys to connect to space,
   * which environment, and what data to replace.
   */
  const createContentType = async (
    options: CreateOrUpdateContentTypeInterface
  ) => {
    return client
      .getSpace(options.spaceId)
      .then(getEnvironment(options.environmentId))
      .then(
        createContentTypeWithId(
          options.contentTypeId,
          options.data as ContentType
        )
      )
      .then(handleSuccess)
      .catch(handleError(options))
  }

  /**
   * Create or update content type.
   *
   * @param options - Options specifying keys to connect to space,
   * which environment, and what data to replace.
   */
  const createOrUpdateContentType = async (
    options: CreateOrUpdateContentTypeInterface
  ) => {
    options.action = options.action || "update"

    if (options.action === "update") {
      await updateContentType(options)
    }

    if (options.action === "create") {
      await createContentType(options)
    }
  }

  /**
   * Process data models.
   */
  const processModels = async () => {
    const models = [
      pageModel,
      seoModel,
      standardPageModel,
      blogArticlePageModel
    ] as CustomContentType[]

    for (const { id, ...data } of models) {
      await createOrUpdateContentType({
        spaceId: process.env.CONTENTFUL_SPACE_ID!,
        environmentId: process.env.CONTENTFUL_ENV!,
        contentTypeId: id,
        data: data
      })
    }
  }

  processModels()
}

if (!process.env.CONTENTFUL_ACCESS_TOKEN) {
  console.error("CONTENTFUL_ACCESS_TOKEN not defined.")
} else if (!process.env.CONTENTFUL_SPACE_ID) {
  console.error("CONTENTFUL_SPACE_ID not defined.")
} else if (!process.env.CONTENTFUL_ENV) {
  console.error("CONTENTFUL_ENV not defined.")
} else {
  migrate()
}
