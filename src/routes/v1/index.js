const {
  createCategory,
  getCategory,
  updateCategoryId,
  getCategoryId,
  deleteCategoryId
} = require('../../controllers/category.controler')
const {
  createUserController,
  LoginController,
  refreshTokenController,
  updateUserId,
  getUserId,
  getUser,
  deleteUserId,
  getUserByMonthControler
} = require('../../controllers/login.controler')
const {
  productController,
  getProduct,
  getProductId,
  updateProductId,
  deleteProductId
} = require('../../controllers/product.controler')
const {
  updateAndCreateContactId,
  getContactControler
} = require('../../controllers/contact.controler')
const {
  getfooterControler,
  updateAndCreatefooterId
} = require('../../controllers/footer.controler')
const {
  createOrderControler,
  getOrderControler,
  getOrderId,
  deleteOrderIdControler,
  updateOrderId,
  getOrderMonthControler
} = require('../../controllers/order.controler')
const {
  getTransactionControler,
  deleteTransactionIdControler,
  getTransactionId,
  updateTransactionId,
  getTransactionMonthControler
} = require('../../controllers/transaction.controler')
const {
  createPostsController,
  deletePostsId,
  getPostsController,
  getPostsId,
  updatePostsId
} = require('../../controllers/posts.controler')

const { getNotiController, updateNotiId } = require('../../controllers/noti.controler')
const { getIntroControler, updateAndCreateIntroId } = require('../../controllers/intro.controler')
const { asyncHandler } = require('../../utils/asyncHandle')
const { authenToken } = require('../../utils/authenToken')
const { uploadsMidleware } = require('../../middlewares/uploadMidleware')
const { getMessages, sendMessage } = require('../../controllers/chat-controler/chat.controler')

const router = require('express').Router()
router.post('/v1/api/create', uploadsMidleware.single('image'), asyncHandler(createUserController))
router.put(
  '/v1/api/userId',
  authenToken,
  uploadsMidleware.single('image'),
  asyncHandler(updateUserId)
)
router.get('/v1/api/user-month', authenToken, asyncHandler(getUserByMonthControler))
router.get('/v1/api/user', authenToken, asyncHandler(getUser))
router.get('/v1/api/userId', authenToken, asyncHandler(getUserId))
router.delete('/v1/api/userId', authenToken, asyncHandler(deleteUserId))
router.post('/v1/api/login', asyncHandler(LoginController))
router.post('/v1/api/refreshToken', asyncHandler(refreshTokenController))
router.get('/v1/api/book', authenToken, asyncHandler(productController))
// category
router.post(
  '/v1/api/category',
  uploadsMidleware.single('image'),
  authenToken,
  asyncHandler(createCategory)
)
router.get('/v1/api/category', asyncHandler(getCategory))
router.get('/v1/api/categoryId', authenToken, asyncHandler(getCategoryId))
router.put(
  '/v1/api/categoryId',
  uploadsMidleware.single('image'),
  authenToken,
  asyncHandler(updateCategoryId)
)
router.delete('/v1/api/categoryId', authenToken, asyncHandler(deleteCategoryId))
// product
router.post(
  '/v1/api/product',
  authenToken,
  uploadsMidleware.array('image[]'),
  asyncHandler(productController)
)
router.get('/v1/api/product', asyncHandler(getProduct))
router.get('/v1/api/productId', asyncHandler(getProductId))
router.put(
  '/v1/api/productId',
  uploadsMidleware.array('image[]'),
  authenToken,
  asyncHandler(updateProductId)
)
router.delete('/v1/api/productId', authenToken, asyncHandler(deleteProductId))
// contact
router.post(
  '/v1/api/contact',
  authenToken,
  uploadsMidleware.single('image'),
  asyncHandler(updateAndCreateContactId)
)
router.get('/v1/api/contact', asyncHandler(getContactControler))
// footer
router.post(
  '/v1/api/footer',
  authenToken,
  uploadsMidleware.single('image'),
  asyncHandler(updateAndCreatefooterId)
)
router.get('/v1/api/footer', asyncHandler(getfooterControler))

// order
router.post('/v1/api/order', authenToken, asyncHandler(createOrderControler))
router.get('/v1/api/order-month', authenToken, asyncHandler(getOrderMonthControler))
router.get('/v1/api/order', authenToken, asyncHandler(getOrderControler))
router.get('/v1/api/orderId', authenToken, asyncHandler(getOrderId))
router.put('/v1/api/orderId', authenToken, asyncHandler(updateOrderId))
router.delete('/v1/api/orderId', authenToken, asyncHandler(deleteOrderIdControler))
// transaction
router.get('/v1/api/transaction', authenToken, asyncHandler(getTransactionControler))
router.get('/v1/api/transaction-month', authenToken, asyncHandler(getTransactionMonthControler))
router.put('/v1/api/transactionId', authenToken, asyncHandler(updateTransactionId))
router.get('/v1/api/transactionId', authenToken, asyncHandler(getTransactionId))
router.delete('/v1/api/transactionId', authenToken, asyncHandler(deleteTransactionIdControler))
// bai viet
router.post('/v1/api/posts', authenToken, asyncHandler(createPostsController))
router.get('/v1/api/posts', asyncHandler(getPostsController))
router.get('/v1/api/postId', authenToken, asyncHandler(getPostsId))
router.put('/v1/api/postId', authenToken, asyncHandler(updatePostsId))
router.delete('/v1/api/postId', authenToken, asyncHandler(deletePostsId))
// gioi thieu
router.post(
  '/v1/api/intro',
  authenToken,
  uploadsMidleware.single('image'),
  asyncHandler(updateAndCreateIntroId)
)
router.get('/v1/api/intro', asyncHandler(getIntroControler))
// thong bao
router.get('/v1/api/noti', authenToken, asyncHandler(getNotiController))
router.put('/v1/api/noti', authenToken, asyncHandler(updateNotiId))
// test
router.get('/v1/api/chat/:id', getMessages)
router.post('/v1/api/send/:id', sendMessage)

module.exports = router
