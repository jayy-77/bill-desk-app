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
import pandas as pd

cred = credentials.Certificate("C:/Users/Admin/Music/Bill-Desk/back-end/API/reports/upi-bill-desk-firebase-adminsdk-8ypmv-9d158df6fb.json")
firebase_admin.initialize_app(cred, {'storageBucket': 'upi-bill-desk.appspot.com'})

db = firestore.client()
client_ref = db.collection("clients")
product_data = {}

def clients(request):
    clients = [x.id for x in client_ref.stream()]
    return JsonResponse({"clients": clients})

def auth(request):
    client = request.GET.dict().get("auth_data")
    client = json.loads(client)
    
    access_key = client_ref.document(client["client"]).get().to_dict()["access_key"]

    return JsonResponse({"status": True if access_key == client["access_key"] else False})
    
def get_product_data(request):
    global product_data
    
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
    
    for i in order:
        tmp_obj = products["product_data"][int(i)]
        products["product_data"][int(i)]["quantity"] = int(tmp_obj["quantity"]) - int(order[i]["purchase_qty"])
        
        try:
            rel_sales_ref.update({
            "sales": firestore.ArrayUnion([{
                "date": str(datetime.datetime.now()).split(" ")[0],
                "time": str(datetime.datetime.now()).split(" ")[1].split(".")[0],
                "name": products["product_data"][int(i)]["name"],
                "quantity": order[i]["purchase_qty"],
                "price": products["product_data"][int(i)]["price"],
                "purchase_value": int(order[i]["purchase_qty"]) * int(products["product_data"][int(i)]["price"])
            }])
        })
        except:
            rel_sales_ref.set({
            "sales": firestore.ArrayUnion([{
                "date": str(datetime.datetime.now()).split(" ")[0],
                "time": str(datetime.datetime.now()).split(" ")[1].split(".")[0],
                "name": products["product_data"][int(i)]["name"],
                "quantity": order[i]["purchase_qty"],
                "price": products["product_data"][int(i)]["price"],
                "purchase_value": int(order[i]["purchase_qty"]) * int(products["product_data"][int(i)]["price"])
            }])
        })
            
    rel_stocks_ref.update({
        "product_data": products["product_data"]
    })    
    
    db.collection("qr_data").document("reliance").update({'upi_url':"",'amount': ""})
    
    return JsonResponse(products)

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

def sales(request):
    sales_data = rel_sales_ref.get().to_dict()
    
    return JsonResponse({
        "sales_data": sales_data
    })
    
def sales_report(request):
    sales_df = {}
    sales_data = rel_sales_ref.get().to_dict()

    for index_1, value_1 in enumerate(sales_data["sales"]):
        date = str(value_1["date"]).split(" ")[0]
        sales_df[index_1] = []
        for value_2 in sales_data["sales"]:
            if date == str(value_2["date"]).split(" ")[0]:
                sales_df[index_1].append(value_2)
                    
    with pd.ExcelWriter(f'{str(datetime.datetime.now()).split(" ")[0]}-sales-report.xlsx') as writer:
        for i in sales_df:
            df = pd.DataFrame(sales_df[i])
            df.to_excel(writer, sheet_name = f"{df['date'][0].split(' ')[0]}", index=False)
    
    return JsonResponse({"file_name": f'{str(datetime.datetime.now()).split(" ")[0]}-sales-report.xlsx'})

def analysis(request):
    pass