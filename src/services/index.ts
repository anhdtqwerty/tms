import { ApiService } from './api-service'

export const createServices = () => {
  return {
    api: new ApiService()
  }
}
