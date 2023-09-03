from django.shortcuts import render
from django.http import JsonResponse
import firebase_admin
import json
from firebase_admin import credentials, firestore, storage
import urllib
import os
import qrcode
import random
import datetime

cred = credentials.Certificate("C:/Users/Admin/Music/Bill-Desk/back-end/API/reports/upi-bill-desk-firebase-adminsdk-8ypmv-9d158df6fb.json")
firebase_admin.initialize_app(cred, {'storageBucket': 'upi-bill-desk.appspot.com'})

db = firestore.client()
rel_stocks_ref = db.collection("stocks").document("reliance")
rel_sales_ref = db.collection("sales").document("reliance")

def get_product_data(request):
    product_data = rel_stocks_ref.get().to_dict()
    
    return JsonResponse(product_data)

def set_product_data(request):
    product_data = request.GET.dict()
    
    rel_stocks_ref.update({
        "product_data": firestore.ArrayUnion([product_data])
    })
    
    return JsonResponse({"status": True})

def order(request):
    order = request.GET.get("order")
    order = json.loads(order)
    products = rel_stocks_ref.get().to_dict()
    sales_data = []
    
    for i in order:
        tmp_obj = products["product_data"][int(i)]
        products["product_data"][int(i)]["quantity"] = int(tmp_obj["quantity"]) - int(order[i]["purchase_qty"])
        
        rel_sales_ref.update({
            "sales": firestore.ArrayUnion([{
                "date": datetime.datetime.now(),
                "name": products["product_data"][int(i)]["name"],
                "quantity": order[i]["purchase_qty"],
                "price": products["product_data"][int(i)]["price"]
            }])
        })
        
    rel_stocks_ref.update({
        "product_data": products["product_data"]
    })    

    return JsonResponse({"status": True})

def upi_qr_operation(request):
    bucket = storage.bucket()
    
    total_bill = request.GET.get("total_bill")
    total_bill = json.loads(total_bill)["bill"]
    
    security_code = random.randint(1000, 9999)
    
    payment_dict = {
        "pa": '8200639454398@paytm',
        "pn": 'jay prajapati',
        "tr": random.randint(10000, 99999),
        "tn": security_code,
        "am": total_bill,
        "cu": "INR"
    }
    
    upi_deep_link = "upi://pay" + '?' + urllib.parse.urlencode(payment_dict)
    img = qrcode.make(upi_deep_link)
    img_name = f"{security_code}.png"
    img.save(img_name)
    
    blob = bucket.blob(img_name)
    blob.upload_from_filename(img_name)
    blob.make_public()
    
    db.collection("qr_data").document("reliance").update({'upi_url':str(blob.public_url),'amount': total_bill})
    print(os.getcwd(), os.listdir())
    os.remove(img_name) 
    
    return JsonResponse({"security_code": security_code})   