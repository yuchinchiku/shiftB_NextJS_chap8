export type CategoryType = {
  id: number;
  name: string;
}

export type CategoryResponse = {
  status: string;
  categories: CategoryType | null;
}
export type CategoriesResponse = {
  status: string;
  categories: CategoryType[];
}
export type UpdateCategoryResponse = {
  status: string;
  categories: CategoryType | null;
}

export type ErrorResponse = {
  status: string;
};

export type DeleteCategoryResponse = {
  status: string;
}

export type CreateCategoryResponse = {
  status: string;
  message: string;
  id: number;
}

export type CreateCategoryRequestBody = {
  name: string;
}
export type UpdateCategoryRequestBody = {
  name: string;
}