package com.smartuni.backend.controller;

import com.smartuni.backend.entity.Assignment;
import com.smartuni.backend.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/assignments")
public class AssignmentController {
    
    @Autowired
    private AssignmentRepository repository;
    
    @GetMapping
    public List<Assignment> get(Assignment probe) {
        return repository.findAll(Example.of(probe));
    }
    
    @GetMapping("/{id}")
    public Assignment getById(@PathVariable String id) {
        return repository.findById(id).orElse(null);
    }
    
    @PostMapping
    public Assignment create(@RequestBody Assignment entity) {
        if (entity.getId() == null || entity.getId().isEmpty()) {
            entity.setId(java.util.UUID.randomUUID().toString());
        }
        return repository.save(entity);
    }
    
    @PutMapping("/{id}")
    public Assignment update(@PathVariable String id, @RequestBody Assignment entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @PatchMapping("/{id}")
    public Assignment patch(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Assignment entity = repository.findById(id).orElse(null);
        if (entity == null) return null;
        
        org.springframework.util.ReflectionUtils.doWithFields(Assignment.class, field -> {
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
