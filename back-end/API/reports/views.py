from django.shortcuts import render
from django.http import JsonResponse
import firebase_admin
import json
from firebase_admin import credentials, firestore

cred = credentials.Certificate("C:/Users/Admin/Music/Bill-Desk/back-end/API/reports/upi-bill-desk-firebase-adminsdk-8ypmv-9d158df6fb.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
rel_stocks_ref = db.collection("stocks").document("reliance")

def get_product_data(request):
    product_data = rel_stocks_ref.get().to_dict()
    
    return JsonResponse(product_data)

def set_product_data(request):
    product_data = request.GET.dict()
    
    rel_stocks_ref.update({
        "product_data": firestore.ArrayUnion([product_data])
    })
    
    return JsonResponse({"status": "ok"})

def order(request):
    return JsonResponse("")