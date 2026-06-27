package com.smartuni.backend.controller;

import com.smartuni.backend.entity.ActivityLog;
import com.smartuni.backend.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/activityLogs")
public class ActivityLogController {
    
    @Autowired
    private ActivityLogRepository repository;
    
    @GetMapping
    public List<ActivityLog> get(ActivityLog probe) {
        return repository.findAll(Example.of(probe));
    }
    
    @GetMapping("/{id}")
    public ActivityLog getById(@PathVariable String id) {
        return repository.findById(id).orElse(null);
    }
    
    @PostMapping
    public ActivityLog create(@RequestBody ActivityLog entity) {
        if (entity.getId() == null || entity.getId().isEmpty()) {
            entity.setId(java.util.UUID.randomUUID().toString());
        }
        return repository.save(entity);
    }
    
    @PutMapping("/{id}")
    public ActivityLog update(@PathVariable String id, @RequestBody ActivityLog entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @PatchMapping("/{id}")
    public ActivityLog patch(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        ActivityLog entity = repository.findById(id).orElse(null);
        if (entity == null) return null;
        
        org.springframework.util.ReflectionUtils.doWithFields(ActivityLog.class, field -> {
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
