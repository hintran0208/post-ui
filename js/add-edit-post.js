import postApi from './api/postApi'
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

    console.log('Mod:', postId ? 'edit' : 'add')
    console.log('DefaultValues:', defaultValues)
  } catch (error) {
    console.log('fail to fetch post details', error)
  }
})()
