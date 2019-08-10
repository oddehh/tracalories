// storage Controller
const StorageCtrl = (function(){
  // public methods
  return {
    storeItem: function(item) {
      items = StorageCtrl.getItemsFromStorage()
      items.push(item)
      localStorage.setItem('items', JSON.stringify(items))
    },
    getItemsFromStorage: function() {
      let items
      if (localStorage.getItem('items') === null) {
        items = []
      } else {
        items = JSON.parse(localStorage.getItem('items'))
      }
      return items
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'))

      const index = items.findIndex(item => item.id === updatedItem.id)
      items.splice(index, 1, updatedItem)

      localStorage.setItem('items', JSON.stringify(items))
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem('items'))

      const index = items.findIndex(item => item.id === id)
      items.splice(index, 1)

      localStorage.setItem('items', JSON.stringify(items))
    },
    clearItemsFromStorage: function() {
      localStorage.removeItem('items')
    },
  }

})()

// Item Controller
const ItemCtrl = (function(){

  // item constructor
  const Item = function(id, name, calories) {
    this.id = id
    this.name = name
    this.calories = calories
  }

  // data structore / state
  const data = {
    // items: [
    //   {id: 0, name: 'Steak Dinner', calories: 1200},
    //   {id: 1, name: 'Cookie', calories: 400},
    //   {id: 2, name: 'Eggs', calories: 300},
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  }

  // public methods
  return {
    getItems: function(){
      return data.items
    },
    getItemById: function(id) {
      return data.items.find( item => item.id === id)
    },
    updateItem: function(name, calories) {
      calories = parseInt(calories)

      // let found = null

      // data.items.forEach((function(item) {
      //   if(item.id === data.currentItem.id) {
      //     item.name = name
      //     item.calories = calories
      //     // get found item object
      //     found = item
      //   }
      // }))
      // return found

      const found = data.items.find(item => item.id === data.currentItem.id)
      if(found) {
        found.name = name
        found.calories = calories
      }
      return found
    },
    getCurrentItem: function() {
      return data.currentItem
    },
    setCurrentItem: function(item) {
      data.currentItem = item
    },
    addItem: function (name, calories) {
      // create id
      let ID
      if(data.items.length > 0) {
        // my take would be: let ID = data.items.length + 1 (+1 is for increasing)
        ID = data.items[data.items.length -1].id + 1
      } else {
        ID =  0
      }
      calories = parseInt(calories)

      newItem = new Item(ID, name, calories)
      data.items.push(newItem)

      return newItem
    },
    deletemItem: function(id) {
      let currentItemIndex = data.items.findIndex(item => item.id === id)
      data.items.splice(currentItemIndex, 1)
    },
    clearAllItems: function() {
      data.items = []
    },
    getTotalCalories: function() {
      // reduce; acc starts at 0.
      return data.items.reduce( (acc, next) => acc + next.calories ,0)
    },
    logData: function() {
      return data
    },
  }

})()

// UI Contoroller
const UICtrl = (function() {

  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
  }

  // public methods
  return {
    populateItemList: function(items) {
      let html = ''

      items.forEach((item) => {
        html += `<li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong><em>${item.calories} calories</em>
        <a href="" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
        </li>
        `
      })
      // insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html
    },
    addListItem: function(item){
      document.querySelector(UISelectors.itemList).style.display = 'block'
      // create li element
      const li = document.createElement('li')
      li.classList = 'collection-item'
      li.id = `item-${item.id}`
      li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} calories</em>
        <a href="" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`

      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`
      const item = document.querySelector(itemID)
      item.remove()
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems)

      listItems = Array.from(listItems)
      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute('id')

        if(itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong><em>${item.calories} calories</em>
        <a href="" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`
        }
      })
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      }
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories
    },
    clearInput: function() {
        document.querySelector(UISelectors.itemNameInput).value = ''
        document.querySelector(UISelectors.itemCaloriesInput).value = ''
      },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories
    },
    removeItems: function() {
      const listItems = document.querySelectorAll(UISelectors.listItems)
      listItems.forEach(item => item.remove())
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none'
    },
    clearEditState: function() {
      UICtrl.clearInput()
      document.querySelector(UISelectors.addBtn).style.display = 'inline'
      document.querySelector(UISelectors.updateBtn).style.display = 'none'
      document.querySelector(UISelectors.deleteBtn).style.display = 'none'
      document.querySelector(UISelectors.backBtn).style.display = 'none'
    },
    showEditState: function () {
      document.querySelector(UISelectors.addBtn).style.display = 'none'
      document.querySelector(UISelectors.updateBtn).style.display = 'inline'
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
      document.querySelector(UISelectors.backBtn).style.display = 'inline'
    },
    getSelectors: function() {
      return UISelectors
    },
}

})()
// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {

  // load events listeners
  const loadEventListeners  = function() {
    // get selectors
    const UISelectors =  UICtrl.getSelectors()

    // add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)

    // disable submit on enter
    document.addEventListener('keypress', function(e) {
      if(e.keyCode === 13  || e.which === 13) {
        e.preventDefault()
        return false
      }
    })

    // edit icon event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)

    // update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit)

    // back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState)

    // delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit)

    // clear all button
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick)

  }

  // event handlers
  const itemAddSubmit = function(e) {
    // get form input form UI controller
    const input = UICtrl.getItemInput()

    // validation
    if(input.name !== '' && input.calories !== '') {
      // add item
      const newItem = ItemCtrl.addItem(input.name, input.calories)
      // add item to UI
      UICtrl.addListItem(newItem)

      // get totall calories
      const totalCalories = ItemCtrl.getTotalCalories()
      UICtrl.showTotalCalories(totalCalories)

      // store to local storare
      StorageCtrl.storeItem(newItem)

      UICtrl.clearInput()
    }
    e.preventDefault()
  }

  const itemEditClick = function(e) {
    if(e.target.classList.contains('edit-item')) {

      const listId = e.target.parentNode.parentNode.id
      const listIdArr = listId.split('-')
      const id = parseInt(listIdArr[1])

      const itemToEdit = ItemCtrl.getItemById(id)
      // set current item
      ItemCtrl.setCurrentItem(itemToEdit)

      UICtrl.addItemToForm()
      UICtrl.showEditState()
    }
    e.preventDefault()
  }

  const itemUpdateSubmit = function(e) {
    // get item input
    const input = UICtrl.getItemInput()

    // update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories)
    // update ui
    UICtrl.updateListItem(updatedItem)

    // update to local storage
    StorageCtrl.updateItemStorage(updatedItem)

    const totalCalories = ItemCtrl.getTotalCalories()
    UICtrl.showTotalCalories(totalCalories)

    e.preventDefault()
  }

  const itemDeleteSubmit = function(e) {
    const currentItem = ItemCtrl.getCurrentItem()

    ItemCtrl.deletemItem(currentItem.id)
    UICtrl.deleteListItem(currentItem.id)

    // delete item form storage
    StorageCtrl.deleteItemFromStorage(currentItem.id)


    const totalCalories = ItemCtrl.getTotalCalories()
    UICtrl.showTotalCalories(totalCalories)

    UICtrl.clearEditState()

    e.preventDefault()
  }

  const clearAllItemsClick = function(e) {
    ItemCtrl.clearAllItems()

    const totalCalories = ItemCtrl.getTotalCalories()
    UICtrl.showTotalCalories(totalCalories)

    UICtrl.removeItems()

    StorageCtrl.clearItemsFromStorage()

    UICtrl.hideList()
  }

  // public metods
  return {
    init: function() {
      UICtrl.clearEditState()

      // fetch items from data
      const items = ItemCtrl.getItems()
      if(items.length === 0) {
        UICtrl.hideList()
      }
      // populate list with items
      UICtrl.populateItemList(items)

      // get totall calories
      const totalCalories = ItemCtrl.getTotalCalories()
      UICtrl.showTotalCalories(totalCalories)

      // load events
      loadEventListeners()
    },
  }

})(ItemCtrl, StorageCtrl, UICtrl)

App.init()