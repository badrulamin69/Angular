package com.smartuni.backend.controller;

import com.smartuni.backend.entity.LeaveRequest;
import com.smartuni.backend.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/leaveRequests")
public class LeaveRequestController {
    
    @Autowired
    private LeaveRequestRepository repository;
    
    @GetMapping
    public List<LeaveRequest> get(LeaveRequest probe) {
        return repository.findAll(Example.of(probe));
    }
    
    @GetMapping("/{id}")
    public LeaveRequest getById(@PathVariable String id) {
        return repository.findById(id).orElse(null);
    }
    
    @PostMapping
    public LeaveRequest create(@RequestBody LeaveRequest entity) {
        if (entity.getId() == null || entity.getId().isEmpty()) {
            entity.setId(java.util.UUID.randomUUID().toString());
        }
        return repository.save(entity);
    }
    
    @PutMapping("/{id}")
    public LeaveRequest update(@PathVariable String id, @RequestBody LeaveRequest entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @PatchMapping("/{id}")
    public LeaveRequest patch(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        LeaveRequest entity = repository.findById(id).orElse(null);
        if (entity == null) return null;
        
        org.springframework.util.ReflectionUtils.doWithFields(LeaveRequest.class, field -> {
            if (updates.containsKey(field.getName())) {
                field.setAccessible(true);
                Object val = updates.get(field.getName());
                if (val != null) {
                    if (field.getType() == Integer.class && val instanceof Number) val = ((Number)val).intValue();
                    if (field.getType() == Double.class && val instanceof Number) val = ((Number)val).doubleValue();
                }
                field.set(entity, val);
            }
        });
        
        return repository.save(entity);
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        repository.deleteById(id);
    }
}
