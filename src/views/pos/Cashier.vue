<template>
    <div
        class="bg-blue-100 dark:bg-sky-950 dark:text-slate-200 h-[calc(100vh-30px)] flex flex-col px-1 pb-1 overflow-hidden select-none mt-8 w-full fixed">
        <!-- Top Bar (Fixed Height) -->
        <div class="grid grid-cols-12 h-12 mb-4">
            <!-- Column 1: Span 2 -->
            <div class="col-span-2 border border-gray-500 p-4 text-center">
                <div class="flex">
                    <span class="text-lg font-bold">Order Queue </span>
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
                    <CommonButton button-text="Create Order" icon="pi pi-pencil" :action="() => router.push('/pos')" />
                    <CommonButton button-text="Dashboard" icon="pi pi-wave-pulse"
                        :action="() => router.push('/admin')" />
                    <CommonButton button-text="" icon="pi pi-power-off"
                        :action="() => { store.currentWaiter = null }" />
                </div>
            </div>
        </div>
        <!-- Screen Canvas (Fills Remaining Space) -->
        <div class="grid grid-cols-12 flex-1 overflow-hidden">
            <!-- Left Panel (Fixed) -->
            <div class="col-span-2 border border-gray-500 p-4 px-1 text-center overflow-y-auto h-full">
                <span
                    class="text-center italics sticky top-0 z-10 p-2 bg-blue-100 dark:bg-sky-950 w-full h-full rounded">All
                    open
                    orders
                </span>
                <div v-if="store.orders.length > 0" class="mt-6">
                    <div v-for="order in store.orders
                        .filter(o => o.order_placed)
                        .sort((a, b) => new Date(b.order_time) - new Date(a.order_time))" :key="order.order_number"
                        @click="store.selectOrderWithAuthCheck(order.order_number)"
                        :class="['flex flex-col gap-2 dark:bg-sky-900 overflow-scroll cursor-pointer border border-gray-500 p-2 rounded-lg mb-2',
                            store.selectedOrder?.order_number === order.order_number ? 'bg-gray-200 dark:bg-sky-600 shadow-md shadow-yellow' : '']">
                        <div class="flex justify-between">
                            <span class="font-semibold">{{ order.order_number }}</span>
                            <span :class="['badge text-white cursor-pointer ',
                                order.order_status === 'Pending' ? 'bg-sky-900' : 'badge-success']">
                                {{ order.order_status }}
                            </span>
                        </div>
                        <span>Waiter: {{order.waiter_id ? waiters.find(waiter => waiter.id === order.waiter_id)?.name :
                            ''}}</span>
                        <div>
                            <CommonButton button-text="Send to kitchen" @click="sendToKitchen(order.order_number)" />
                        </div>
                    </div>
                </div>
                <div v-else class="mt-12">
                    <span class=" bg-info w-full text-white cursor-pointer text-center alert "><i
                            class="pi pi-info-circle"></i>
                        All open orders will appear on this panel
                    </span>
                </div>
            </div>
            <!-- Center Panel (Scrollable) -->
            <div class="relative col-span-5 border border-gray-500 p-4 text-center overflow-y-auto h-full">
                <div class="sticky top-0 bg-grey-100  dark:bg-sky-950 dark:text-slate-200 z-10 px-4 ">
                    <div class="flex flex-row space-x-1 lg:space-x-4 overflow-x-auto">
                        <!-- <CommonButton icon="pi pi-building-columns"
                            :icon2="orderType == 'dine_in' ? 'pi pi-check-circle ms-0.5' : ''" button-text="Dine In"
                            :classes="[orderType == 'dine_in' ? 'bg-yellow border border-yellow text-white' : '']"
                            :action="() => setOrderType('dine_in')" />
                        <CommonButton icon="pi pi-box"
                            :classes="[orderType == 'take_away' ? 'bg-yellow border border-yellow text-white' : '']"
                            :icon2="orderType == 'take_away' ? 'pi pi-check-circle ms-0.5' : ''" button-text="Take Away"
                            :action="() => setOrderType('take_away')" />
                        <CommonButton icon="pi pi-truck"
                            :icon2="orderType == 'delivery' ? 'pi pi-check-circle ms-0.5' : ''"
                            :classes="[orderType == 'delivery' ? 'bg-yellow border border-yellow text-white' : '']"
                            button-text="Delivery" :action="() => setOrderType('delivery')" /> -->
                    </div>
                </div>
                <div class="grid card p-1 rounded-sm">
                    <div class="flex justify-between gap-4 ">
                        <div
                            class="flex flex-row gap-2 items-center justify-center border rounded-md px-2 border-gray-500">
                            <label for="waiter" class="block text-sm  font-semibold me-2">Waiter:</label>
                            {{ store.currentWaiter?.name }} <span v-if="store.currentWaiter?.name"
                                class="mx-2 cursor-pointer text-red-500"
                                @click="() => { store.currentWaiter = null; store.selectedOrder = null }"><i
                                    class="pi  pi-power-off"></i></span>
                        </div>

                    </div>
                    <span class="mb-2  mt-2">ORDER SUMMERY {{ '(' +
                        store.selectedOrder?.order_number ? store.selectedOrder?.order_number : '' + ')' }}
                    </span>
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
                            <tbody v-if="store.selectedOrder?.items.length > 0">
                                <tr v-for="(orderItem, index) in store.selectedOrder?.items" :key="index">
                                    <td class="py-1 px-2 text-start">{{ orderItem.item }}</td>
                                    <td class="py-1 px-2 flex gap-3 font-mono"><i
                                            @click="() => store.reduceOrderItem(index)"
                                            class="pi pi-minus p-2 cursor-pointer "></i>{{
                                                orderItem.quantity }}<i
                                            @click="store.addOrCreateOrderItem(orderItem.item_category_id, orderItem.item_id, categories)"
                                            class="pi pi-plus p-2 cursor-pointer"></i></td>
                                    <td class="py-1 px-2 text-right font-mono">{{ (orderItem.amount) *
                                        orderItem.quantity }}</td>
                                    <td class="py-1 px-2 text-right">
                                        <span
                                            class="badge badge-error cursor-pointer  text-white hover:scale-105 transition-all duration-300"
                                            @click="() => store.removeOrderItem(index)">
                                            <i class="pi pi-trash"></i></span>
                                    </td>
                                </tr>
                            </tbody>
                            <span class=" bg-info w-full text-center alert mt-12 ml-32 text-white" v-else><i
                                    class="pi pi-plus"></i>
                                Click orders on the left to load</span>
                        </table>
                    </div>
                    <div class="w-full flex justify-center text-center mt-2">
                        <CommonButton v-if="store.selectedOrder?.items.length > 0" :action="() => showModal('invoice')"
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
                                store.selectedOrder?.order_number }} ]</span>
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
                                    <tr v-for="(orderItem, index) in store.selectedOrder?.items" :key="index">
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
                                    <p>Order Date: {{ new Date(store.selectedOrder?.order_time).toLocaleString()
                                        }}
                                    </p>

                                    <p> Till:576096</p>
                                    <p>Order No: {{ store.selectedOrder?.order_number }}</p>
                                </div>
                                <hr class="dashed-line">
                                <div class="receipt-body">
                                    <div class=" receipt-item">
                                        <span>QTY</span>
                                        <span>AMT</span>
                                    </div>
                                    <hr class="dashed-line">
                                    <div v-for="(orderItem, index) in store.selectedOrder?.items" :key="index"
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
                                        store.selectedOrder?.waiter_id)?.name}}</p>
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
                                    <p>Date: {{ new Date(store.selectedOrder?.order_time).toLocaleString()
                                        }}
                                    </p>
                                    <p>Order No: {{ store.selectedOrder?.order_number }}</p>
                                </div>
                                <hr class="dashed-line">
                                <div class="receipt-body">
                                    <div class=" receipt-item">
                                        <span>QTY</span>
                                        <span>AMT</span>
                                    </div>
                                    <hr class="dashed-line">
                                    <div v-for="(orderItem, index) in store.selectedOrder?.items" :key="index"
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
                                        store.selectedOrder?.waiter_id)?.name}}</p>
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
                                    <p>Order Date:{{ store.selectedOrder?.order_time }}</p>
                                    <p>Order No: {{ store.selectedOrder?.order_number }}</p>
                                    <p>Table No: {{tables?.find(t => t.id == store.selectedOrder?.table_id)?.name}}</p>
                                </div>

                                <div class="receipt-body">
                                    <div v-for="(orderItem, index) in store.selectedOrder?.items" :key="index"
                                        class="receipt-item">
                                        <span class="item-desc">{{ orderItem.item }}</span>
                                        <span class="item-amount"> {{ orderItem.amount }}</span>
                                    </div>
                                </div>

                                <div class="receipt-thankyou">
                                    <p>Waiter : {{waiters.find(waiter => waiter.id ===
                                        store.selectedOrder?.waiter_id)?.name}}</p>
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
                                <th class="py- px-2 border-t text-right font-mono">
                                    {{ computeTotal }}
                                </th>
                            </tr>
                            <tr>
                                <th class="py- px-2 border-t text-left"></th>
                                <th class="py- px-2 border-t text-left">
                                    Discount
                                </th>
                                <th class="py- px-2 border-t text-right font-mono">
                                    20
                                </th>
                            </tr>
                            <tr>
                                <th class="py- px-2 border-t text-left"></th>
                                <th class="py- px-2 border-t text-left">
                                    VAT
                                </th>
                                <th class="py- px-2 border-t text-right font-mono">
                                    20
                                </th>
                            </tr>
                            <tr>
                                <th class="py-2 px-2 border-t text-left"></th>
                                <th class="py- px-2 border-t text-left font-bold text-3xl text-error">
                                    Total
                                </th>
                                <th class="py-2 px-2 border-t text-right font-bold text-3xl text-error font-mono">
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

                <div class="border px-2">
                    <p class="text-center mt-4">
                        Empty panel
                    </p>
                </div>
            </div>
        </div>
    </div>
    <dialog id="calculator_id" class="modal">
        <div class="modal-box dark:text-slate-200 dark:bg-sky-950">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-1 top-1">✕</button>
            </form>

            <div class="flex flex-col items-center font-mono">
                <!-- Display -->
                <div class="p-4 space-y-2 border rounded shadow-md w-64 select-none">
                    <input v-model="expression" type="text"
                        class="p-2 border bg-blue-100 text-gray-900 rounded w-full text-right" placeholder="0"
                        readonly />
                    <p class="text-lg font-bold text-center">{{ result }}</p>

                    <!-- Buttons -->
                    <div class="grid grid-cols-4 gap-2 mt-2 text-center">
                        <!-- Row 1 -->
                        <button class="btn" @click="append('7')">7</button>
                        <button class="btn" @click="append('8')">8</button>
                        <button class="btn" @click="append('9')">9</button>
                        <button class="btn btn-error" @click="backspace()">⌫</button>

                        <!-- Row 2 -->
                        <button class="btn" @click="append('4')">4</button>
                        <button class="btn" @click="append('5')">5</button>
                        <button class="btn" @click="append('6')">6</button>
                        <button class="btn" @click="append('*')">×</button>

                        <!-- Row 3 -->
                        <button class="btn" @click="append('1')">1</button>
                        <button class="btn" @click="append('2')">2</button>
                        <button class="btn" @click="append('3')">3</button>
                        <button class="btn" @click="append('-')">−</button>

                        <!-- Row 4 -->
                        <button class="btn" @click="append('0')">0</button>
                        <button class="btn" @click="append('.')">.</button>
                        <button class="btn" @click="append('/')">/</button>
                        <button class="btn" @click="append('+')">+</button>

                        <!-- Row 5 -->
                        <button class="btn col-span-2" @click="append('/')">÷</button>
                        <button class="btn col-span-2 btn-warning" @click="clear()">C</button>
                    </div>
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
    <Kb ref="target" v-if="showKeyboard" @input="appendToInput" @backspace="removeChar" @enter="submitInput" />
</template>

<script setup>
import { ref, computed, watch, reactive, onMounted } from "vue";
import CommonButton from "../../components/Buttons/CommonButton.vue";
import { useRouter } from "vue-router";
import { useMainStore } from "../../stores";
import { useToast } from "primevue/usetoast";
import { useThemeStore } from "../../stores/Theme";
import Kb from "../../components/Kb/Kb.vue";


const toastPrime = useToast();

const theme = useThemeStore();
const store = useMainStore();

const router = useRouter();
const query = ref("");
const selectedTable = ref(null);
const orderType = ref("dine_in");
const selectedCustomer = ref(null);
const flashMessage = ref(null)
const tables = ref(null);
const zones = ref(null);
const selectedCategory = ref(null);
const cashAmount = ref(0);
const waiter_id = ref(null);
const waiter_password = ref(null);

const orders = reactive([]);
const message = ref("");
const categories = ref([]);
const waiters = ref([]);
const customers = ref([{ id: 1, name: "Default Customer" }]);

const activeInput = ref("");

onMounted(async () => {
    try {
        window.electronAPI.getWaiters().then(data => {
            waiters.value = data.waiter;
        });

    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

const computeTotal = computed(() => {
    return store.selectedOrder
        ? store.selectedOrder.items.reduce((total, item) => total + (item.amount * item.quantity), 0)
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

    if (store.selectedOrder.paid) {
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
    if (store.selectedOrder) {
        const orderIndex = orders.findIndex(order => order.order_number === store.selectedOrder.order_number);
        if (orderIndex !== -1) {
            orders[orderIndex].paid = true;
            store.selectedOrder = null;
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











const expression = ref('');

//calculator functions
const result = computed(() => {

    return eval(expression.value.replace(/[^-()\d/*+.]/g, ''))

})

const append = (val) => {
    expression.value += val
}

const clear = () => {
    expression.value = ''
}

const backspace = () => {
    expression.value = expression.value.slice(0, -1)
}

// keyboard input handling
const showKeyboard = ref(false);
const target = ref(null); // This should be the element you want to detect clicks outside of

import { onClickOutside } from "@vueuse/core";


onClickOutside(target, event => {
    showKeyboard.value = false;
    activeInput.value = '';
    console.log('Clicked outside the keyboard');
})

const handleFocus = (field) => {
    setTimeout(() => {
        activeInput.value = field;
        showKeyboard.value = true;
        console.log('Active input set to:', activeInput.value);
    }, 250);
};


const getActiveModel = () => {

    if (activeInput.value === 'query') return query;
    if (activeInput.value === 'waiter-password') return waiter_password;
    if (activeInput.value === 'waiter-id') return waiter_id;
    return null;
};



const appendToInput = (char) => {
    const target = getActiveModel();
    if (!target) { console.log('No target', target); return; }
    target.value += char;
    console.log('target', target.value);
};


const removeChar = () => {
    const target = getActiveModel();
    target.value = target.value.slice(0, -1);
};

watch(activeInput, (newValue) => {
    if (newValue === 'waiter-password' || newValue === 'waiter-id' || newValue === 'query') {
        showKeyboard.value = true;
    }
    // } else {
    //     showKeyboard.value = false;
    // }
});


</script>
