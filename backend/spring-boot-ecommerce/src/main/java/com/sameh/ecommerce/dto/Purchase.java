package com.sameh.ecommerce.dto;

import com.sameh.ecommerce.entity.Address;
import com.sameh.ecommerce.entity.Customer;
import com.sameh.ecommerce.entity.Order;
import com.sameh.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
