package com.secure.notebunker.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public Map<String, String> hello() {
        Map<String, String> map = new HashMap<>();
        map.put("message", "hello");
        return map;
    }
    @GetMapping("/contact")
    public Map<String, String> contact() {
        Map<String, String> map = new HashMap<>();
        map.put("message", "contact page");
        return map;
    }
    @GetMapping("/hi")
    public List<String> hi() {
        List<String> list = new ArrayList<>();
        list.add("Hi");
        return list;
    }
}
