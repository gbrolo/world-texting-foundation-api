export const ACRONYM_ERROR = {
  errorId: 'ACRONYM_ERROR',
  errorMessage: 'Internal server error. Please try again later.'
}

export const NOT_FOUND_ACRONYM_ERROR = {
  errorId: 'NOT_FOUND_ACRONYM_ERROR',
  errorMessage: 'There is no match for requested acronym'
}

export const DUPLICATE_ACRONYM_ERROR = {
  errorId: 'DUPLICATE_ACRONYM_ERROR',
  errorMessage: 'The acronym you are trying to add already exists'
}

export const SEARCH_NOT_FOUND_ACRONYM_ERROR = {
  errorId: 'SEARCH_NOT_FOUND_ACRONYM_ERROR',
  errorMessage: 'There is no match for requested search query'
}

export const RANDOM_COUNT_TOO_BIG_ERROR = {
  errorId: 'RANDOM_COUNT_TOO_BIG_ERROR',
  errorMessage: 'Your requested count is bigger than the acronym count. Please, request a lower acronym count.'
}