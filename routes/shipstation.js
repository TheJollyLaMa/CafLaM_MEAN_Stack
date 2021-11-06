const express = require('express');
const router = express.Router();
var xml = require('xml');


/* GET Route as defined by shipstation custom store */
/* https://help.shipstation.com/hc/en-us/articles/360025856192-Custom-Store-Development-Guide#get-call-0-4 */
// [Your Web Endpoint]?action=export&start_date=[Start Date]&end_date=[End Date]&page=1
// [Your Web Endpoint]?action=export&start_date=[Start Date]&amp;end_date=[End Date]&amp;page=1
//  must return all orders within the above given parameters in the below type of format

router.get('/', async (req, res, next) => {
/*
    for each order in PurchaseOrdersList
      if order is after start_date && before end_date && OrderStatus is "Needs to Ship" or whatever
        then ...
          add order to xml_for_shipstation
*/
    // var xml_for_shipstation = {
    //   Orders: {
    //      _attr: {
    //        pages: 1
    //      },
    //      Orders: {
    //        OrderID: {_cdata: res.body.orderId},
    //        OrderNumber: {_cdata: res.body.orderNumber},
    //        OrderDate: {_cdata: res.body.orderDate},
    //        OrderStatus: {_cdata: res.body.orderStatus},
    //        LastModified: {_cdata: res.body.orderNumber},
    //        ShippingMethod: {_cdata: res.body.orderNumber},
    //        PaymentMethod: {_cdata: res.body.orderNumber},
    //        CurrencyCode: {_cdata: res.body.orderNumber},
    //        OrderTotal: {_cdata: res.body.orderNumber},
    //        TaxAmount: {_cdata: res.body.orderNumber},
    //        ShippingAmount: {_cdata: res.body.orderNumber},
    //        CustomerNotes: {_cdata: res.body.orderNumber},
    //        InternalNotes: {_cdata: res.body.orderNumber},
    //        Gift: {_cdata: res.body.orderNumber},
    //        GiftMessage: {_cdata: res.body.orderNumber},
    //        CustomField1: {_cdata: res.body.orderNumber},
    //        CustomField2: {_cdata: res.body.orderNumber},
    //        CustomField3: {_cdata: res.body.orderNumber},
    //        Customer: {
    //          CustomerCode: {_cdata: res.body.customer.customerCode},
    //          BillTo: {
    //            Name: {_cdata: res.body.customer.billto.name},
    //            Company: {_cdata: res.body.customer.billto.company},
    //            Phone: {_cdata: res.body.customer.billto.phone},
    //            Email: {_cdata: res.body.customer.billto.email}
    //          },
    //          ShipTo: {
    //            Name: {_cdata: res.body.customer.shipto.name},
    //            Company: {_cdata: res.body.customer.shipto.company},
    //            Address1: {_cdata: res.body.customer.shipto.address1},
    //            Address2: {_cdata: res.body.customer.shipto.address2},
    //            City: {_cdata: res.body.customer.shipto.city},
    //            State: {_cdata: res.body.customer.shipto.state},
    //            PostalCode: {_cdata: res.body.customer.shipto.postalcode},
    //            Phone: {_cdata: res.body.customer.shipto.phone}
    //          }
    //        },
    //        Items: {
    //          Item: {
    //            Sku: {_cdata: res.body.customer.shipto.name},
    //            Name: {_cdata: res.body.customer.shipto.name},
    //            ImageUrl: {_cdata: res.body.customer.shipto.company},
    //            Weight: {_cdata: res.body.customer.shipto.address1},
    //            WeightUnits: {_cdata: res.body.customer.shipto.address2},
    //            Quantity: {_cdata: res.body.customer.shipto.city},
    //            UnitPrice: {_cdata: res.body.customer.shipto.state},
    //            Location: {_cdata: res.body.customer.shipto.postalcode},
    //            Options: {
    //              Option: {
    //                Name: {_cdata: res.body.customer.shipto.phone},
    //                Value: {_cdata: res.body.customer.shipto.phone},
    //                Name: {_cdata: res.body.customer.shipto.phone}
    //              },
    //              Option: {
    //                Name: {_cdata: res.body.customer.shipto.phone},
    //                Value: {_cdata: res.body.customer.shipto.phone},
    //                Name: {_cdata: res.body.customer.shipto.phone}
    //              }
    //            }
    //          },
    //          Item: {
    //            Sku: {_cdata: res.body.customer.shipto.name},
    //            Name: {_cdata: res.body.customer.shipto.name},
    //            ImageUrl: {_cdata: res.body.customer.shipto.company},
    //            Weight: {_cdata: res.body.customer.shipto.address1},
    //            WeightUnits: {_cdata: res.body.customer.shipto.address2},
    //            Quantity: {_cdata: res.body.customer.shipto.city}
    //          }
    //         }
    //       }
    //     }
    //   };
    // console.log(xml(xml_for_shipstation));
    //
    // res.type('Content-Type', 'aaplication/xml');
    // res.send(xml(xml_for_shipstation));

});





module.exports = router;
