
export type Ingredient = {
  id: string
  name: string
  created_at: string
  created_by: string
  ingredients_to_tags?: Array<{
    tag_id: string
    ingredients_tags: {
      name: string
    }
  }>
}

export type Tag = {
  id: string
  name: string
  created_by: string
}
