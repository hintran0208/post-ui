import postApi from './api/postApi'
import { initPagination, initSearch, renderPostList, renderPagination, toast } from './utils'

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location)

    if (filterName) url.searchParams.set(filterName, filterValue)

    // reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1)
    history.pushState({}, '', url)

    const { data, pagination } = await postApi.getAll(url.searchParams)
    renderPostList('postList', data)
    renderPagination('pagination', pagination)
  } catch (error) {
    console.log('failed to fetch post list', error)
  }
}

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', (event) => {
    const confirmElement = document.getElementById('confirmation')
    const yesButton = confirmElement.querySelector('[data-id="yes"]')
    const closeButton = confirmElement.querySelector('[data-id="close"]')

    if (!confirmElement) return
    if (!window.bootstrap) return

    const modal = new window.bootstrap.Modal(confirmElement)
    if (modal) modal.show()

    yesButton.addEventListener('click', async () => {
      try {
        const post = event.detail

        await postApi.remove(post.id)
        await handleFilterChange()

        modal.hide()
        toast.success('Remove post successfully')
      } catch (error) {
        console.log('failed to remove post', error)
        toast.error(error.message)
      }
    })

    closeButton.addEventListener('click', () => modal.hide())
  })
}

;(async () => {
  try {
    const url = new URL(window.location)

    // update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 12)

    history.pushState({}, '', url)
    const queryParams = url.searchParams

    registerPostDeleteEvent()

    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    })

    initSearch({
      elementId: 'search',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    })

    // const { data, pagination } = await postApi.getAll(queryParams)
    // renderPostList('postList', data)
    // renderPagination('pagination', pagination)
    handleFilterChange()
  } catch (error) {
    console.log('get all failed', error)
  }
})()
