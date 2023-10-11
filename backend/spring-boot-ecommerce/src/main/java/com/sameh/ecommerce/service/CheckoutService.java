package com.sameh.ecommerce.service;

import com.sameh.ecommerce.dto.Purchase;
import com.sameh.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
