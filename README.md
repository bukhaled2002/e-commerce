<!-- VENDOR:
First Name
Last Name
Email
Profile Pic
Password
Confirm Password
Products:[PRODUCT_ID]
Date
Location
PhoneNUmber
Reviews:[Review_ID]

Customer:
First Name
Last Name
Email
Profile Pic
Password
Confirm Password
WishList:[]
Product_Puchaced
Location
PhoneNUmber
Reviews:[REVIEW_ID]
Points (for Loyality)

Product:
Product Name
Category
Description
Tags
Images:[Img]
Price
Discount:[percentage , default]
Free Shipping: BOOLEAN
Vendor:[
V_Name
]
Product_Reviews:[REVIEW_ID]
Quantity

Order:
Customer:[Customer_Name]
Product:[
Name,
Vendor
Rating
]
shipping:[
address
price
]
payment:[
method:[CASH, VISA]
]
Price:[
TOTAL:shippingPrice + (ProductPrice - discount)
]
Shipped:[BOOLEAN]

BLOGS:
USER:[COSTUMER or VENDOR]
CONTENT
IMAGE
LIKES:[USER or VENDOR]

COMMENTS:
COSTUMER or VENDOR
COMMENT
LIKES:[USER or VENDOR]

REVIEW:
Costumer: COSTUMER_ID
PRODUCT: PRODUCT_ID
RATING: [1-5]
COMMENT -->

<!-- END POINTS -->

VENDOR:
/signin //Done
/signup //Done
/update //Done
/forgotPassword
/resetPassword
/createProduct //Done
/deleteProduct //Done
/updateProduct //Done
(GET)vendor/monthly-stats/:month - (with providing chart)
(GET)vendor/monthly-stats/:product/:month - (with providing chart)

COSTUMER:
/signin //Done
/signup //Done
/update //Done
/forgotPassword
/resetPassword
(GET)/PRODUCTS/?CATEGORY="SS"&bBLAVLA="sasa" 1/2 Done
(POST)/Wishlist //Done
(GET)/Wishlist //Done
(DELETE)/Wishlist //Done
(GET)/weeklyTrends - (get moslty purchaced in the last 7 days)
(GET)/specialOffers - (get products with discounts)

BLOGS:

<!-- get all blogs -->

(GET)/blogs

<!-- add blog -->

(POST)/blogs
(GET)/blogs/:blogId
(PATCH)/blogs/:blogId
(GET)/blogs/:blogId/comments
(POST)/blogs/:blogId/comments
(PATCH)/blogs/:blogId/comments/:commentId

PRODUCTS:
(GET)/products //Done
(POST)/products //Done
(PATCH)/products/:productId //Done

REVIEWS:
(GET)/products/:productID/reviews
(POST)/products/:productID/reviews
(PATCH)/products/:productID/reviews/:reveiwId

DASHBOARD

<!--  -->

(GET)/historyOrders -(with previewing payment method / shipping method / shipped or not)
(GET)/vendors //getAll - (preview products and number of items sold)
(GET)/vendors/:id //getOne
(GET)/monthly-stats/:month - (with providing chart)
(GET)vendor/monthly-stats/:month - (with providing chart)
(GET)vendor/monthly-stats/:product/:month - (with providing chart)
(GET)/notifications

<!--  -->

(GET)/customers //Done
(GET)/customers/:customerId - (products buyed and reviews on it and total points ) //Done

<!-- for security -->

(DELETE)/product/:productId
(DELETE)/customer/:customerId
(DELETE)/vendor/:vendorId

<!-- description of Loyality System -->
<!--
    if customer spent 200 pound:
        customer will take 50 point
    1/4 of money spent will be added as points
    then choose from awards choosen by customers
     -->
