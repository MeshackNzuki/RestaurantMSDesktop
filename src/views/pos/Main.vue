<template>
    <div
        class="font-bold flex bg-blue-100  dark:bg-sky-950 dark:text-slate-200 px-4 justify-between pt-0.5 select-none">
        <span class="font-bold text-emerald-700 badge badge-success bg-opacity-25"> Connected <i
                class="pi pi-wifi"></i></span> <span
            class="text-red-500 font-bold animate-pulse badge badge-error bg-opacity-25"> Offline <i
                class="pi pi-sort-alt-slash "></i></span>
        <span class="text-emerald-700 badge badge-success bg-opacity-25"><i class="pi pi-sync pi-spin mx-1 "></i>
            Syncing </span>
    </div>
    <div
        class="bg-blue-100 dark:bg-sky-950 dark:text-slate-200 h-[calc(100vh-30px)] flex flex-col px-2 pb-2 overflow-hidden select-none">
        <!-- Top Bar (Fixed Height) -->
        <div class="grid grid-cols-12 h-12 mb-4">
            <!-- Column 1: Span 2 -->
            <div class="col-span-2 border border-gray-500 p-4 text-center">
                <div class="flex">
                    <span class="text-lg font-bold">Order Queue</span>
                </div>
            </div>
            <!-- Column 2: Span 5 -->
            <div class="col-span-5 border border-gray-500 p-4 text-center">
                <div class="flex justify-between align-center">
                    <span class="text-lg font-bold">Order Workspace</span>
                    <span class="space-x-4">
                        <CommonButton button-text="Calculator" icon="pi pi-calculator"
                            :action="() => showModal('calculator_id')" />
                        <CommonButton button-text="Help" icon="pi pi-question" :action="() => showModal('help')" />
                    </span>
                </div>
            </div>
            <!-- Column 3: Span 5 -->
            <div class="col-span-5 border border-gray-500 p-4 text-center">
                <div class="flex justify-between align-center">
                    <CommonButton button-text="Last 10 sales" icon="pi pi-refresh"
                        :action="() => router.push('/sales')" />
                    <CommonButton button-text=" Go to sales List" icon="pi pi-list"
                        :action="() => router.push('/sales')" />
                    <CommonButton button-text=" Dashboard" icon="pi pi-wave-pulse"
                        :action="() => router.push('/admin')" />
                    <CommonButton button-text="" icon="pi pi-power-off" />
                </div>
            </div>
        </div>
        <!-- Screen Canvas (Fills Remaining Space) -->
        <div class="grid grid-cols-12 flex-1 overflow-hidden">
            <!-- Left Panel (Fixed) -->
            <div class="col-span-2 border border-gray-500 p-4 text-center">
                <span class="text-center italics">Latest on top (Highlighted : selected)</span>
                <div v-if="orders.length > 0">
                    <div v-for="order in orders
                        .filter(o => o.closed)
                        .sort((a, b) => new Date(b.order_time) - new Date(a.order_time))" :key="order.order_number"
                        @click="selectOrder(order.order_number)" :class="['flex flex-col gap-2 dark:bg-sky-900 overflow-scroll cursor-pointer border border-gray-500 p-2 rounded-lg mb-2',
                            selectedOrder?.order_number === order.order_number ? 'bg-gray-200 shadow' : '']">
                        <div class="flex justify-between">
                            <span class="font-semibold">{{ order.order_number }}</span>
                            <span :class="['badge text-white cursor-pointer ',
                                order.order_status === 'Pending' ? 'bg-sky-900' : 'badge-success']">
                                {{ order.order_status }}
                            </span>
                        </div>
                        <span>Waiter: {{order.waiter_id ? waiters.find(waiter => waiter.id === order.waiter_id).name :
                            ''}}</span>
                        <div>
                            <CommonButton button-text="Send to kitchen" @click="sendToKitchen(order.order_number)" />
                        </div>
                    </div>
                </div>
                <div v-else>
                    <span class=" bg-info w-full text-white  text-center alert "><i class="pi pi-info-circle"></i>
                        No orders to display
                    </span>
                </div>
            </div>
            <!-- Center Panel (Scrollable) -->
            <div class=" relative col-span-5 border border-gray-500 p-4 text-center overflow-y-auto h-full">
                <div class="sticky top-0 bg-grey-100  dark:bg-sky-950 dark:text-slate-200 z-10 px-4 ">
                    <div class="flex flex-row space-x-1 lg:space-x-4 overflow-x-auto">
                        <CommonButton icon="pi pi-building-columns"
                            :icon2="orderType == 'dine_in' ? 'pi pi-check-circle' : ''" button-text="Dine In"
                            :action="() => setOrderType('dine_in')" />
                        <CommonButton icon="pi pi-box" :icon2="orderType == 'take_away' ? 'pi pi-check-circle' : ''"
                            button-text="Take Away" :action="() => setOrderType('take_away')" />
                        <CommonButton icon="pi pi-truck" :icon2="orderType == 'delivery' ? 'pi pi-check-circle' : ''"
                            button-text="Delivery" :action="() => setOrderType('delivery')" />
                    </div>
                </div>
                <div class="grid card p-1 rounded-sm">
                    <div class="flex justify-between gap-4 ">
                        <div
                            class="flex flex-row gap-2 items-center justify-center border rounded-md px-2 border-gray-500">
                            <label for="waiter" class="block text-sm  font-semibold me-2">Waiter:</label>
                            <select id="waiter" v-model="selectedWaiter" placeholder="Select waiter"
                                class="mt-1 block w-full pl-3 pr-10 py-2  border-gray-300 focus:outline-none focus:ring-grey-1000 focus:border-grey-1000 sm:text-sm rounded-md text-gray-800">
                                <option v-for="waiter in waiters" :key="waiter.id" :value="waiter.id">{{ waiter.name }}
                                </option>
                            </select>
                            <div class="py-2" @click="lock_waiter = !lock_waiter">
                                <span v-if="lock_waiter" class="badge badge-error text-white animate-pulse">
                                    <i class="pi pi-lock me-1"></i> Locked
                                </span>
                                <span v-else class="badge badge-info text-white">
                                    <i class="pi pi-unlock me-1"></i> Lock
                                </span>
                            </div>
                        </div>
                        <div
                            class="flex flex-row gap-2 items-center justify-center border rounded-md px-2 border-gray-500 ">
                            <label for="customer" class="block text-sm font-semibold me-2 ">Customer:</label>
                            <select id="customer" v-model="selectedCustomer"
                                class="mt-1 block w-full pl-3 pr-10 py-2  border-gray-500 focus:outline-none focus:ring-grey-1000 focus:border-grey-1000 sm:text-sm rounded-md text-gray-800">
                                <option selected value="">Default Customer</option>
                                <option v-for="customer in customers" :key="customer.id" :value="customer.id">{{
                                    customer.name }}</option>
                            </select>
                        </div>
                    </div>
                    <span class="mb-2 font-bold mt-2">KITCHEN ORDER SUMMERY {{ '(' +
                        selectedOrder?.order_number ? selectedOrder?.order_number : '' + ')' }}<span
                            class="badge badge-error mx-2 cursor-pointer hover:scale-105 text-white"
                            @click="clearOrder()"><i class="pi pi-times me-1"></i>Close Order</span> <span
                            class="badge badge-error mx-2 cursor-pointer hover:scale-105 text-white"
                            @click="CancelOrder()"><i class="pi pi-trash me-1"></i>Cancel this Order</span></span>
                    <div class="overflow-y-auto  border border-gray-300 rounded-lg max-h-[180px] lg:max-h-[450px] ">
                        <table class="min-w-full ">
                            <thead>
                                <tr>
                                    <th class=" py-2 px-2 text-left">Item</th>
                                    <th class="py-2 px-2 text-left">Quantity</th>
                                    <th class="py-2 px-2 text-right">Amount</th>
                                    <th class="py-2 px-2 text-right">Action</th>
                                </tr>
                            </thead>

                            <tbody v-if="selectedOrder?.items.length > 0">
                                <tr v-for="(orderItem, index) in selectedOrder?.items" :key="index">
                                    <td class="py-1 px-2 text-start">{{ orderItem.item }}</td>
                                    <td class="py-1 px-2 flex gap-3"><i @click="() => reduceOrderItem(index)"
                                            class="pi pi-minus p-2 cursor-pointer"></i>{{
                                                orderItem.quantity }}<i
                                            @click="addOrderItem(orderItem.item_category_id, orderItem.item_id)"
                                            class="pi pi-plus p-2 cursor-pointer"></i></td>
                                    <td class="py-1 px-2 text-right">{{ (orderItem.amount) * orderItem.quantity }}</td>
                                    <td class="py-1 px-2 text-right">
                                        <span
                                            class="badge badge-error text-white hover:scale-105 transition-all duration-300"
                                            @click="() => removeOrderItem(index)">
                                            <i class="pi pi-trash"></i></span>

                                    </td>
                                </tr>
                            </tbody>
                            <span class=" bg-info w-full text-center alert mt-12 ml-32 text-white" v-else><i
                                    class="pi pi-plus"></i>
                                Click
                                items on the
                                right
                                to add to
                                order</span>
                        </table>
                    </div>
                    <div class="w-full flex justify-center text-center mt-2">
                        <CommonButton v-if="selectedOrder?.items.length > 0" :action="() => showModal('invoice')"
                            button-text="View / Print Provisional Invoice" />
                    </div>
                </div>

                <dialog id="invoice" class="modal modal-bottom sm:modal-middle">
                    <div class="modal-box dark:text-slate-200 dark:bg-sky-950 w-11/12 max-w-5x">
                        <Success :msg="flashMessage" />
                        <form method="dialog">
                            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <div id="invoice"
                            class="w-full bg-gray-50 border mt-3 dark:bg-sky-950 dark:text-slate-200 p-1 rounded-md">
                            <span class="text-italic font-bold underline">Invoice Summary [{{
                                selectedOrder?.order_number }} ]</span>
                            <table id="print-invoicex" class=" min-w-full rounded-lg my">
                                <hr class="">
                                <thead>
                                    <tr>
                                        <th class="py-2 px-2 border-b text-left">
                                            Item
                                        </th>
                                        <th class="py-2 px-2 border-b text-left"></th>
                                        <th class="py-2 px-2 border-b text-right">
                                            Amount (KSH)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(orderItem, index) in selectedOrder?.items" :key="index">
                                        <td class="py-1 px-2 border-b text-start">
                                            {{ orderItem.item }}
                                        </td>
                                        <td class="py-1 px-2 border-b"></td>
                                        <td class="py-1 px-2 border-b text-right">
                                            {{ orderItem.amount }}
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th class="py-2 px-2 border-t text-left"></th>
                                        <th class="py-2 px-2 border-t text-left">
                                            Sub Total
                                        </th>
                                        <th class="py-2 px-2 border-t text-right">
                                            KES {{ computeTotal }}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th class="py-2 px-2 border-t text-left"></th>
                                        <th class="py-2 px-2 border-t text-left">
                                            Discount
                                        </th>
                                        <th class="py-2 px-2 border-t text-right">
                                            20
                                        </th>
                                    </tr>
                                    <tr>
                                        <th class="py-2 px-2 border-t text-left"></th>
                                        <th class="py-2 px-2 border-t text-left">
                                            VAT
                                        </th>
                                        <th class="py-2 px-2 border-t text-right">
                                            20
                                        </th>
                                    </tr>
                                    <tr>
                                        <th class="py-2 px-2 border-t text-left"></th>
                                        <th class="py-2 px-2 border-t text-left">
                                            Total
                                        </th>
                                        <th class="py-2 px-2 border-t text-right">
                                            KES {{ computeTotal + 20 }}
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>

                            <div id="print-invoice" class="hidden">
                                <div class="receipt-header">
                                    <hr class="dashed-line">
                                    <hr class="dashed-line">
                                    <h2>Gozero Restaurant</h2>
                                    <hr class="dashed-line">
                                    <hr class="dashed-line">
                                    <p>This is not an Official Receipt,
                                        Please Insist on the Official Receipt
                                        after Paying the Bill.
                                    </p>
                                    <hr class="dashed-line">
                                    <p>Order Date: {{ new Date(selectedOrder?.order_time).toLocaleString()
                                    }}
                                    </p>

                                    <p> Till:576096</p>
                                    <p>Order No: {{ selectedOrder?.order_number }}</p>
                                </div>
                                <hr class="dashed-line">
                                <div class="receipt-body">
                                    <div class=" receipt-item">
                                        <span>QTY</span>
                                        <span>AMT</span>
                                    </div>
                                    <hr class="dashed-line">
                                    <div v-for="(orderItem, index) in selectedOrder?.items" :key="index"
                                        class="receipt-item">
                                        <span class="item-desc">{{ orderItem.item }}</span>
                                        <span class="item-amount"> {{ orderItem.amount }}</span>
                                    </div>
                                    <hr class="dashed-line">
                                </div>

                                <div class="receipt-footer">
                                    <div class="receipt-total">
                                        <span>Sub Total</span>
                                        <span>KES {{ computeTotal }}</span>
                                    </div>
                                    <div class="receipt-total">
                                        <span>Discount</span>
                                        <span>- KES 20.00</span>
                                    </div>
                                    <div class="receipt-total">
                                        <span>VAT</span>
                                        <span>KES 20.00</span>
                                    </div>
                                    <div class="receipt-total total">
                                        <span>Total</span>
                                        <span>KES {{ (computeTotal + 20) }}</span>
                                    </div>
                                </div>
                                <hr class="dashed-line">
                                <hr class="dashed-line">
                                <div class="receipt-thankyou">
                                    <p>You were served by : {{waiters.find(waiter => waiter.id ===
                                        selectedOrder?.waiter_id)?.name}}</p>
                                    <p>Thank you</p>
                                    <small>Solution by gozerolabs.com</small>
                                </div>
                            </div>
                            <div id="print-receipt" class="hidden">
                                <div class="receipt-header">
                                    <hr class="dashed-line">
                                    <hr class="dashed-line">
                                    <h2>Gozero Restaurant Receipt</h2>
                                    <hr class="dashed-line">
                                    <hr class="dashed-line">
                                    <hr class="dashed-line">
                                    <p>Date: {{ new Date(selectedOrder?.order_time).toLocaleString()
                                    }}
                                    </p>
                                    <p>Order No: {{ selectedOrder?.order_number }}</p>
                                </div>
                                <hr class="dashed-line">
                                <div class="receipt-body">
                                    <div class=" receipt-item">
                                        <span>QTY</span>
                                        <span>AMT</span>
                                    </div>
                                    <hr class="dashed-line">
                                    <div v-for="(orderItem, index) in selectedOrder?.items" :key="index"
                                        class="receipt-item">
                                        <span class="item-desc">{{ orderItem.item }}</span>
                                        <span class="item-amount"> {{ orderItem.amount }}</span>
                                    </div>
                                    <hr class="dashed-line">
                                </div>

                                <div class="receipt-footer">
                                    <div class="receipt-total">
                                        <span>Sub Total</span>
                                        <span>KES {{ computeTotal }}</span>
                                    </div>
                                    <div class="receipt-total">
                                        <span>Discount</span>
                                        <span>- KES 20.00</span>
                                    </div>
                                    <div class="receipt-total">
                                        <span>VAT</span>
                                        <span>KES 20.00</span>
                                    </div>
                                    <div class="receipt-total total">
                                        <span>Total</span>
                                        <span>KES {{ (computeTotal + 20) }}</span>
                                    </div>
                                    <div class="receipt-total total">
                                        <span>Paid</span>
                                        <span>KES{{
                                            cashAmount -
                                            (computeTotal
                                                +
                                                20) }} </span>
                                    </div>
                                    <div class="receipt-total total">
                                        <span>Balance</span>
                                        <span>KES {{
                                            cashAmount -
                                            (computeTotal
                                                +
                                                20) }} </span>
                                    </div>
                                </div>
                                <hr class="dashed-line">
                                <hr class="dashed-line">
                                <div class="receipt-thankyou">
                                    <p>You were served by : {{waiters.find(waiter => waiter.id ===
                                        selectedOrder?.waiter_id)?.name}}</p>
                                    <p>Thank you</p>
                                    <small>Solution by gozerolabs.com</small>
                                </div>
                            </div>
                            <div id="send-order-to-kitchen" class="hidden">
                                <div class="receipt-header">
                                    <hr class="dashed-line">
                                    <hr class="dashed-line">
                                    <h2>Gozero Restaurant</h2>
                                    <hr class="dashed-line">
                                    <hr class="dashed-line">
                                    <hr class="dashed-line">
                                    <p>Order Date:{{ selectedOrder?.order_time }}</p>
                                    <p>Order No: {{ selectedOrder?.order_number }}</p>
                                    <p>Table No: {{tables?.find(t => t.id == selectedOrder?.table_id)?.name}}</p>
                                </div>

                                <div class="receipt-body">
                                    <div v-for="(orderItem, index) in selectedOrder?.items" :key="index"
                                        class="receipt-item">
                                        <span class="item-desc">{{ orderItem.item }}</span>
                                        <span class="item-amount"> {{ orderItem.amount }}</span>
                                    </div>
                                </div>

                                <div class="receipt-thankyou">
                                    <p>Waiter : {{waiters.find(waiter => waiter.id ===
                                        selectedOrder?.waiter_id)?.name}}</p>
                                    <small>Solution by gozerolabs.com</small>
                                </div>
                            </div>

                        </div>
                        <div class="w-full flex justify-center text-center mt-2">
                            <CommonButton button-text="Close Order / Print Invoice" :action="() => printOrder()" />
                        </div>
                    </div>
                </dialog>
                <div ref="footer"
                    class="w-full absolute bottom-0 right-0 left-0 bg-gray-50 border  dark:bg-sky-950 dark:text-slate-200 p-1  rounded-md">
                    <table class="min-w-full rounded-lg">
                        <tfoot>
                            <tr>
                                <th class="py- px-2 border-t text-left"></th>
                                <th class="py- px-2 border-t text-left">
                                    Sub Total
                                </th>
                                <th class="py- px-2 border-t text-right">
                                    KES {{ computeTotal }}
                                </th>
                            </tr>
                            <tr>
                                <th class="py- px-2 border-t text-left"></th>
                                <th class="py- px-2 border-t text-left">
                                    Discount
                                </th>
                                <th class="py- px-2 border-t text-right">
                                    20
                                </th>
                            </tr>
                            <tr>
                                <th class="py- px-2 border-t text-left"></th>
                                <th class="py- px-2 border-t text-left">
                                    VAT
                                </th>
                                <th class="py- px-2 border-t text-right">
                                    20
                                </th>
                            </tr>
                            <tr>
                                <th class="py-2 px-2 border-t text-left"></th>
                                <th class="py- px-2 border-t text-left font-bold text-3xl text-error">
                                    Total
                                </th>
                                <th class="py-2 px-2 border-t text-right font-bold text-3xl text-error">
                                    KES {{ (computeTotal + 20).toLocaleString() }}
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                    <div class="w-full flex justify-center text-center gap-6">
                        <span class="py- px-2 border-t text-left cursor-pointer  font-bold "
                            @click="showModal('cash')">Cash</span>
                        <span class="py- px-2 border-t text-left font-bold cursor-pointer" @click="showModal('mpesa')">
                            Mpesa
                        </span>
                        <span class=" py- px-2 border-t text-right font-bold cursor-pointer" @click="showModal('card')">
                            Card
                        </span>
                        <dialog id="cash" class="modal modal-bottom sm:modal-middle">
                            <div class="modal-box dark:text-slate-200 dark:bg-sky-950 w-11/12 max-w-5x">
                                <Success :msg="flashMessage" />
                                <form method="dialog">
                                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <div class="mt-4 p-8">
                                    <input type="number" v-model="cashAmount" placeholder="Enter Cash Amount"
                                        class="input input-bordered w-full rounded-lg" />
                                    <h5 v-if="cashAmount > 0" class="mt-4 font-bold">Customer balance: {{ cashAmount -
                                        (computeTotal
                                            +
                                            20) }}</h5>

                                </div>
                                <div class="w-full flex justify-center text-center mt-2">
                                    <CommonButton button-text="Accept Cash Payment"
                                        :action="() => acceptCashPayment()" />
                                </div>
                            </div>
                        </dialog>
                        <dialog id="mpesa" class="modal modal-bottom sm:modal-middle">
                            <div class="modal-box dark:text-slate-200 dark:bg-sky-950 w-11/12 max-w-5x">
                                <Success :msg="flashMessage" />
                                <form method="dialog">
                                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <div></div>
                                <div class="w-full flex justify-center text-center mt-2">
                                    <CommonButton button-text="Accept Cash Payment"
                                        :action="() => acceptCashPayment()" />
                                </div>
                            </div>
                        </dialog>
                        <dialog id="card" class="modal modal-bottom sm:modal-middle">
                            <div class="modal-box dark:text-slate-200 dark:bg-sky-950 w-11/12 max-w-5x">
                                <Success :msg="flashMessage" />
                                <form method="dialog">
                                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <div></div>
                                <div class="w-full flex justify-center text-center mt-2">
                                    <CommonButton button-text="Accept Cash Payment"
                                        :action="() => acceptCashPayment()" />
                                </div>
                            </div>
                        </dialog>
                    </div>
                </div>
            </div>
            <!-- Right Panel (Scrollable) -->
            <div class="col-span-5 border border-gray-500 px-1 text-center overflow-y-auto h-full">
                <!-- Search Bar and Category List (Sticky) -->
                <div class="sticky top-0 bg-blue-100 z-10 p-4">
                    <!-- Search Bar -->
                    <div class="relative h-10 w-full mb-4">
                        <div class="flex items-center border border-gray-300 rounded-full p-2 bg-white shadow-md">
                            <i class="pi pi-search mr-2"></i>
                            <input type="text" v-model="query" placeholder="Search all items..."
                                class="flex-1 outline-none" />
                        </div>
                    </div>
                    <!-- Category List -->
                    <div class="flex flex-row overflow-x-auto space-x-2">
                        <span :class="['whitespace-nowrap badge hover:scale-105 transition duration-300 cursor-pointer p-3', theme?.currentTheme === 'Light'
                            ? 'bg-sky-500 text-gray-100'
                            : theme?.themes[theme.currentTheme]?.bg +
                            ' ' +
                            theme?.themes[theme.currentTheme]?.text]" v-for="category in categories" :key="category.id"
                            @click="() => selectCategory(category.id)">
                            {{ category.name }}
                        </span>

                    </div>
                    <h2 class="text-xl font-bold mb-4">
                        {{ query ? "Search Results" : selectedCategory ? selectedCategory.name : "All Items" }}
                    </h2>

                </div>
                <!-- Display Foods -->
                <div class="border px-2">
                    <div class="grid grid-cols-3 gap-4">
                        <div v-for="food in filteredFoods" :key="food.id"
                            class="bg-sky-900 p-2 rounded-lg shadow-sm hover:scale-105 transition duration-300 cursor-pointer flex flex-col items-center"
                            @click="addOrderItem(food.categoryId, food.id)">

                            <img :src="getRandomImage()" alt="Food Image" class="h-32 w-full object-cover rounded"
                                @error="handleImageError" />

                            <h3 class="text-normal text-white font-semibold mt-2">{{ food.name }}</h3>
                            <!-- <small class="text-sm">{{ food.description }}</small> -->
                            <p class="font-bold mt-1 badge badge-success text-white">Ksh {{ food.price }}
                            </p>
                        </div>
                    </div>
                    <p v-if="filteredFoods.length === 0" class="text-center mt-4">
                        No matching items found!
                    </p>
                </div>
            </div>
        </div>
        <dialog id="invoice" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box dark:text-slate-200 dark:bg-sky-950 w-11/12 max-w-5x">
                <Success :msg="flashMessage" />
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div id="invoice"
                    class="w-full bg-gray-50 border mt-3 dark:bg-sky-950 dark:text-slate-200 p-1 rounded-md">
                    <span class="text-italic font-bold underline">Invoice Summary</span>
                    <table id="print-invoicex" class="font-mono min-w-full rounded-lg ">
                        <thead>
                            <tr>
                                <th class="py-2 px-2 border-b text-left">
                                    Description
                                </th>
                                <th class="py-2 px-2 border-b text-left"></th>
                                <th class="py-2 px-2 border-b text-right">
                                    Amount (KSH)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(orderItem, index) in selectedOrder?.items" :key="index">
                                <td class="py-1 px-2 border-b text-start">
                                    {{ orderItem.item }}
                                </td>
                                <td class="py-1 px-2 border-b"></td>
                                <td class="py-1 px-2 border-b text-right">
                                    {{ orderItem.amount }}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th class="py-2 px-2 border-t text-left"></th>
                                <th class="py-2 px-2 border-t text-left">
                                    Sub Total
                                </th>
                                <th class="py-2 px-2 border-t text-right">
                                    KES {{ computeTotal }}
                                </th>
                            </tr>
                            <tr>
                                <th class="py-2 px-2 border-t text-left"></th>
                                <th class="py-2 px-2 border-t text-left">
                                    Discount
                                </th>
                                <th class="py-2 px-2 border-t text-right">
                                    -
                                </th>
                            </tr>
                            <tr>
                                <th class="py-2 px-2 border-t text-left"></th>
                                <th class="py-2 px-2 border-t text-left">
                                    VAT
                                </th>
                                <th class="py-2 px-2 border-t text-right">
                                    {{ useMainStore.vat }}%
                                </th>
                            </tr>
                            <tr>
                                <th class="py-2 px-2 border-t text-left"></th>
                                <th class="py-2 px-2 border-t text-left">
                                    Total
                                </th>
                                <th class="py-2 px-2 border-t text-right">
                                    KES {{ computeTotal + (useMainStore.vat / 100 * computeTotal) }}
                                </th>
                            </tr>
                        </tfoot>
                    </table>

                    <div id="print-invoice" class="hidden">
                        <div class="receipt-header">
                            <h2>Store Name</h2>
                            <p>1234 Market St, City, Country</p>
                            <p>Tel: (123) 456-7890</p>
                        </div>

                        <div class="receipt-body">
                            <div v-for="(orderItem, index) in selectedOrder?.items" :key="index" class="receipt-item">
                                <span class="item-desc">{{ orderItem.item }}</span>
                                <span class="item-amount"> {{ orderItem.amount }}</span>
                            </div>
                        </div>

                        <div class="receipt-footer">
                            <div class="receipt-total">
                                <span>Sub Total</span>
                                <span>KES {{ computeTotal }}</span>
                            </div>
                            <div class="receipt-total">
                                <span>Discount</span>
                                <span>- KES 20.00</span>
                            </div>
                            <div class="receipt-total">
                                <span>VAT</span>
                                <span>{{ useMainStore }}%</span>
                            </div>
                            <div class="receipt-total total">
                                <span>Total</span>
                                <span> KES {{ computeTotal + (useMainStore.vat / 100 * computeTotal) }}</span>
                            </div>
                        </div>

                        <div class="receipt-thankyou">
                            <p>Thank you for eating with us!</p>
                            <p>Visit again soon.</p>
                        </div>
                    </div>

                </div>
                <div class="w-full flex justify-center text-center">
                    <CommonButton button-text="Print Invoice" :action="() => printDiv()" />
                </div>

            </div>
        </dialog>
    </div>
    <dialog id="select_table" class="modal modal-lg  modal-middle">
        <div class="modal-box w-11/12 max-w-5xl dark:text-slate-200 dark:bg-sky-950">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-1 top-1">✕</button>
            </form>
            <div class="w-full flex justify-between items-center px-6">
                <div class="flex">
                    <div class="flex items-center mr-4 ">
                        <div class="h-6 w-6 rounded-full bg-gradient-to-r from-emerald-600 to bg-emerald-400 mr-2">
                        </div>
                        <div class="dark:text-white ml-2">Available</div>
                    </div>
                    <div class="flex items-center ml-2">
                        <div class="h-6 w-6 rounded-full bg-gradient-to-r from-red-500  to-rose-600 mr-2"></div>
                        <div class="dark:text-white ml-2">Reserved</div>
                    </div>
                </div>
            </div>
            <div class="px-6">
                <div v-for="zone in zones" class="  mt-6 mb-6">
                    <h4 class="dark:text-white font-bold mb-2">{{ zone.name }}</h4>
                    <hr>
                    <div class="flex flex-wrap w-full justify-center">
                        <div v-for="table in tables" :key="zone.id">
                            <span v-if="table.zone?.name == zone.name">
                                <span
                                    class="m-2 flex justify-center rounded-3xl items-center px-4 py-2 cursor-pointer select-none text-white hover:scale-105 transition duration-300"
                                    @click="setSelectedTable(table.id)"
                                    :class="getReservationStatus(table.has_reservation_on_date)"
                                    style="height:70px; width:90px">
                                    <strong>{{ table.name }}</strong>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </dialog>
    <dialog id="calculator_id" class="modal">
        <div class="modal-box dark:text-slate-200 dark:bg-sky-950 ">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-1 top-1">✕</button>
            </form>
            <div class="flex align-center justify-center font-mono">
                <div class="p-4 space-y-4 border rounded shadow-md w-64 select-none">
                    <input v-model="expression" type="text" class="p-2 border bg-blue-100 rounded w-full"
                        placeholder="Enter calculation" />
                    <p class="text-lg font-bold text-center">{{ result }}</p>
                </div>
            </div>
        </div>
    </dialog>
    <dialog id="help" class="modal">
        <div class="modal-box dark:text-slate-200 dark:bg-sky-950 ">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-1 top-1">✕</button>
            </form>
            <div class="flex align-center justify-center">
                <div class="p-4 space-y-4  ">
                    <h2 class="text-lg font-bold">Gozerolabs Help Center</h2>
                    <p class="text-sm">This is a point of sale system for a restaurant. You can add items to an
                        order
                        and send it to the kitchen.</p>
                    <p class="text-sm">You can also print a provisional invoice for the order.</p>
                    <p class="text-sm">You can also view the last 10 sales and go to the sales list.</p>
                    <p class="text-sm">You can also view the dashboard and log out.</p>
                    <p class="text-sm font-semibold">For more help, please visit <a
                            href="https://www.gozerolabs.com/pos" class="text-sky-500" target="_blank">Gozerolabs <i
                                class="pi pi-external-link"></i></a>
                    </p>
                </div>
            </div>
        </div>
    </dialog>
</template>

<script setup>
import { ref, computed, watch, reactive, onMounted } from "vue";
import CommonButton from "../../components/Buttons/CommonButton.vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useMainStore } from "../../stores";
import { useToast } from "primevue/usetoast";
import { useThemeStore } from "../../stores/Theme";

const toastPrime = useToast();

const theme = useThemeStore();

const router = useRouter();
const query = ref("");
const selectedWaiter = ref(null);
const selectedTable = ref(null);
const selectedOrder = ref(null);
const orderType = ref("dine_in");
const selectedCustomer = ref(null);
const tables = ref(null);
const zones = ref(null);
const lock_waiter = ref(false);
const selectedCategory = ref(null);
const cashAmount = ref(0);

const orders = reactive([]);
const categories = ref([]);
const waiters = ref([]);
const customers = ref([{ id: 1, name: "Default Customer" }]);

onMounted(async () => {
    try {

        const categoriesResponse = await axios.get("admin/foods");

        categories.value = categoriesResponse.data.data;

        const waitersResponse = await axios.get("/waiters");

        waiters.value = waitersResponse.data.data.waiter;

        const customersResponse = await axios.get("/customers");

        customers.value = customersResponse.data.data;

        const tablesResponse = await axios.get("admin/tables");

        tables.value = tablesResponse.data.data.tables;

        const response = await axios.get("/admin/zones");
        zones.value = response.data.data;


    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

// Function to select category
const selectCategory = (categoryId) => {
    query.value = null; // Clear search

    // If clicking the same category, reset selection
    if (selectedCategory.value && selectedCategory.value.id === categoryId) {
        selectedCategory.value = null;
    } else {
        selectedCategory.value = { ...categories.value.find(category => category.id === categoryId) };
    }
};

// Filter foods based on search query or category
const filteredFoods = computed(() => {
    let allFoods = categories.value.flatMap(category =>
        category.foods.map(food => ({ ...food, categoryId: category.id }))
    );

    if (query.value) {
        return allFoods.filter(food =>
            food.name.toLowerCase().includes(query.value.toLowerCase())
        );
    }

    return selectedCategory.value
        ? selectedCategory.value.foods.map(food => ({ ...food, categoryId: selectedCategory.value.id }))
        : allFoods;
});


const handleImageError = (event) => {
    if (!event.target.dataset.error) {
        event.target.src = 'https://img.freepik.com/free-vector/abstract-logo-flame-shape_1043-44.jpg?w=740';
        event.target.dataset.error = "true";
    }
};


watch(query, (newQuery) => {
    if (!newQuery) {
        selectedCategory.value = null;
    }
});

watch(selectedOrder, (newValue, oldValue) => {
    console.log("selectedOrder changed:", oldValue, "=>", newValue);
});

watch(selectedTable, (newValue, oldValue) => {
    console.log("selectedTable changed:", oldValue, "=>", newValue);
});

watch(selectedWaiter, (newValue, oldValue) => {
    console.log("selectedWaiter changed:", oldValue, "=>", newValue);
});

const setSelectedTable = (tableId) => {
    selectedTable.value = tables.value.find(table => table.id === tableId);
    if (selectedOrder.value) {
        selectedOrder.table_id = tableId;
    }
    closeModals();
};

const selectOrder = (orderNumber) => {
    selectedOrder.value = orders.find(order => order.order_number === orderNumber);
};

const addOrderItem = (categoryId, itemId) => {
    let category = categories.value.find(category => category.id === categoryId);
    if (category) {
        let item = category.foods.find(food => food.id === itemId);
        if (item) {
            if (orders.length === 0 || !selectedOrder.value) {
                const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}${Math.floor(Math.random() * 9000) + 1000}`;
                const orderTime = new Date().toISOString();
                const newOrder = {
                    order_number: orderNumber,
                    order_status: "Pending",
                    order_time: orderTime,
                    items: [],
                    customer_id: selectedCustomer.value?.id || null,
                    waiter_id: selectedWaiter.value?.id || null,
                    table_id: selectedTable.value?.id || null,
                };
                orders.push(newOrder);
                selectedOrder.value = newOrder;
            }

            const existingItemIndex = selectedOrder.value.items.findIndex(orderItem => orderItem.item === item.name);
            if (existingItemIndex > -1) {
                selectedOrder.value.items[existingItemIndex].quantity += 1;
            } else {
                selectedOrder.value.items.push({
                    item: item.name,
                    description: item.description,
                    amount: item.price,
                    quantity: 1,
                    item_id: item.id,
                    item_category_id: categoryId,
                });
            }
        }
    }
};

const removeOrderItem = (itemIndex) => {
    selectedOrder.value.items.splice(itemIndex, 1);
};

const reduceOrderItem = (itemIndex) => {
    if (selectedOrder.value.items[itemIndex].quantity > 1) {
        selectedOrder.value.items[itemIndex].quantity -= 1;
    }
};

const computeTotal = computed(() => {
    return selectedOrder.value
        ? selectedOrder.value.items.reduce((total, item) => total + (item.amount * item.quantity), 0)
        : 0;
});

const showModal = async (modalId) => {
    const modal = document.getElementById(modalId);

    if (modalId === "cash" || modalId === "mpesa" || modalId === "card") {
        await verify_order();
    }
    if (modal) {
        modal.showModal();
    }
};

const acceptCashPayment = async () => {

    await verify_order();

    if (selectedOrder.paid) {
        toastPrime.add({
            severity: "error",
            summary: "Error",
            detail: 'Order has already been paid',
            life: 2000,
        });
        return;
    }

    if (cashAmount.value < computeTotal.value + 20) {
        toastPrime.add({
            severity: "error",
            summary: "Error",
            detail: 'Cash amount is less than total amount',
            life: 2000,
        });
        return;
    }

    const change = cashAmount.value - (computeTotal.value + 20);
    toastPrime.add({
        severity: "success",
        summary: "Payment Accepted",
        detail: `Change: KES ${change}`,
        life: 2000,
    });

    const printContents = document.getElementById("print-receipt").innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800,top=' + (window.innerHeight / 2 - 300) + ',left=' + (window.innerWidth / 2 - 400));
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            body { font-family: "Courier New", monospace; }
            .receipt { width: 300px; margin: auto; padding: 10px; border: 1px dashed #000; }
            .receipt-header, .receipt-thankyou { text-align: center; }
            .dashed-line { border-top: 1px dashed #000; margin: 3px 0; }
            .receipt-item, .receipt-total { display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="receipt">${printContents}</div>
        </body>
      </html>
    `);
    printWindow.document.close();

    printWindow.onload = () => {
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    markOrderAsPaid();

};

const markOrderAsPaid = () => {
    if (selectedOrder.value) {
        const orderIndex = orders.findIndex(order => order.order_number === selectedOrder.value.order_number);
        if (orderIndex !== -1) {
            orders[orderIndex].paid = true;
            selectedOrder.value = null;
            toastPrime.add({
                severity: "success",
                summary: "Order Paid",
                detail: 'Order has been marked as paid',
                life: 5000,
            });
        }
    }
};

const closeModals = () => {
    const modals = document.querySelectorAll("dialog");
    modals.forEach(modal => modal.close());
};
// Set order type (e.g., dine-in or take-out)
const setOrderType = (type) => {
    orderType.value = type;
    if (type === "dine_in") {
        showModal("select_table");
    }
};

// Clear the selected order
const clearOrder = async () => {

    await verify_order()

    if (selectedOrder.value) {
        const orderIndex = orders.findIndex(order => order.order_number === selectedOrder.value.order_number);
        if (orderIndex !== -1) {
            orders[orderIndex].closed = true;
        }
    }

    selectedOrder.value = null;
    selectedTable.value = null;
    if (!lock_waiter) {
        selectedWaiter.value = null;
    }
};

const CancelOrder = () => {
    if (!selectedOrder.value) return;

    if (selectedOrder.value.closed) {
        toastPrime.add({
            severity: "error",
            summary: "Error",
            detail: 'This order was closed and sent to the kitchen, Please follow up with the kitchen',
            life: 4000,
        });
        return;
    }

    const orderNumber = selectedOrder.value.orderNumber;
    const index = orders.findIndex(order => order.orderNumber === orderNumber);

    if (index !== -1) {
        orders.splice(index, 1);
        selectedOrder.value = null;
    }
};


const verify_order = () => {
    return new Promise((resolve, reject) => {
        try {
            if (!selectedOrder.value) {
                toastPrime.add({
                    severity: "error",
                    summary: "Error",
                    detail: 'Order is empty!',
                    life: 4000,
                });
                reject();
                return;
            }

            if (!selectedOrder.value.customer_id) {
                selectedOrder.value.customer_id = selectedCustomer.value?.id;
            }

            if (!selectedOrder.value.waiter_id) {
                if (selectedWaiter.value) {
                    selectedOrder.value.waiter_id = selectedWaiter.value;
                } else {
                    toastPrime.add({
                        severity: "error",
                        summary: "Error",
                        detail: 'Please select a waiter',
                        life: 4000,
                    });
                    reject();
                    return;
                }
            }

            if (orderType.value === "dine_in" && !selectedOrder.value.table_id) {
                if (selectedTable.value) {
                    selectedOrder.value.table_id = selectedTable.value.id;
                } else {
                    toastPrime.add({
                        severity: "error",
                        summary: "Error",
                        detail: 'Please select a table',
                        life: 4000,
                    });
                    reject();
                    return;
                }
            }

            if (!selectedOrder.value.waiter_id) {
                if (selectedWaiter.value) {
                    selectedOrder.value.waiter_id = selectedWaiter.value;
                } else {
                    toastPrime.add({
                        severity: "error",
                        summary: "Error",
                        detail: 'Please select a waiter',
                        life: 4000,
                    });
                    reject();
                    return;
                }
            }

            resolve();
        } catch (error) {
            reject(error);
        }
    });
};


// Print order details (for receipt)
const printOrder = async () => {
    //commit order
    await verify_order()

    closeModals()

    if (selectedOrder.value) {
        const orderIndex = orders.findIndex(order => order.order_number === selectedOrder.value.order_number);
        if (orderIndex !== -1) {
            orders[orderIndex].closed = true; selectedOrder.value = null;
        }
    }

    toastPrime.add({
        severity: "success",
        summary: "Order Queued",
        detail: 'Order has been closed, please send to kitchen',
        life: 4000,
    });

    const printContents = document.getElementById("print-invoice").innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800,top=' + (window.innerHeight / 2 - 300) + ',left=' + (window.innerWidth / 2 - 400));
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            body { font-family: "Courier New", monospace; }
            .receipt { width: 250px; margin: auto; padding: 10px; border: 1px dashed #000; }
            .receipt-header, .receipt-thankyou { text-align: center; }
            .dashed-line { border:none;border-top: 1px dashed #000; margin: 10px 0; }
            .receipt-item, .receipt-total { display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="receipt">${printContents}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

};

const sendToKitchen = async (ordernumber) => {

    selectOrder(ordernumber)

    closeModals()

    await verify_order()

    if (selectedOrder.value) {
        const orderIndex = orders.findIndex(order => order.order_number === selectedOrder.value.order_number);
        if (orderIndex !== -1) {
            orders[orderIndex].processing = true; selectedOrder.value = null;
        }
    }

    const printContents = document.getElementById("send-order-to-kitchen").innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800,top=' + (window.innerHeight / 2 - 300) + ',left=' + (window.innerWidth / 2 - 400));
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            body { font-family: "Courier New", monospace; }
            .receipt { width: 300px; margin: auto; padding: 10px; border: 1px dashed #000; }
            .receipt-header, .receipt-thankyou { text-align: center; }
            .dashed-line { border-top: 1px dashed #000; margin: 3px 0; }
            .receipt-item, .receipt-total { display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="receipt">${printContents}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

};



const expression = ref('');

const result = computed(() => {
    try {
        return eval(expression.value);
    } catch {
        return 'Syntax Error!';
    }
});

const getReservationStatus = (reservations) => {
    if (reservations) {
        return "bg-gradient-to-r from-red-500  to-rose-600  ";
    } else {
        return "bg-gradient-to-r from-emerald-600 to bg-emerald-400";
    }
};


const getRandomImage = () => {
    const images = [
        "https://img.freepik.com/free-photo/top-view-table-full-food_23-2149209253.jpg?ga=GA1.1.605289806.1739780445&semt=ais_keywords_boost",
        "https://img.freepik.com/free-photo/closeup-roasted-meat-with-sauce-vegetables-fries-plate-table_181624-35847.jpg?ga=GA1.1.605289806.1739780445&semt=ais_keywords_boost",
        "https://img.freepik.com/free-photo/chicken-skewers-with-slices-sweet-peppers-dill_2829-18809.jpg?ga=GA1.1.605289806.1739780445&semt=ais_keywords_boost",
        "https://img.freepik.com/free-photo/chicken-skewers-with-onions-top-salad_1220-567.jpg?ga=GA1.1.605289806.1739780445&semt=ais_keywords_boost",
        "https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141352.jpg?ga=GA1.1.605289806.1739780445&semt=ais_keywords_boost",
        "https://img.freepik.com/premium-photo/uzbek-dish-kazan-kabob-with-lamb-potatoes_219193-7370.jpg?ga=GA1.1.605289806.1739780445&semt=ais_keywords_boost",
    ]
    return images[Math.floor(Math.random() * images.length)];
};
</script>
