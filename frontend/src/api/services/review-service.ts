import { axiosInstance } from "../axios-instance";

export const ReviewApi = {
  createReview: async (rating: number, comment: string, propertyId: string) => {
    return await axiosInstance.post(`/reviews/properties/${propertyId}`, {
      rating,
      comment,
      propertyId,
    });
  },

  getReviewsByPropertyId: async (propertyId: string) => {
    return await axiosInstance.get(`/reviews/properties/${propertyId}`);
  },

  getReviewsByUserId: async (userId: string) => {
    return await axiosInstance.get(`/reviews/users/${userId}`);
  },

  updateReview: async (id: string, rating: number, comment: string) => {
    return await axiosInstance.patch(`/reviews/${id}`, { rating, comment });
  },

  deleteReview: async (id: string) => {
    return await axiosInstance.delete(`/reviews/${id}`);
  },
};
