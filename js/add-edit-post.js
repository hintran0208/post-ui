import postApi from './api/postApi'
import { initPostForm } from './utils/post-form'

;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    // let defaultValues = {
    //   title: '',
    //   description: '',
    //   author: '',
    //   imageUrl: '',
    // }

    // if (postId) {
    //   defaultValues = await postApi.getById(postId)
    // }

    const defaultValues = Boolean(postId)
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        }

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: (formValues) => console.log('submit', formValues),
    })
  } catch (error) {
    console.log('fail to fetch post details', error)
  }
})()
