package com.smartuni.backend.controller;

import com.smartuni.backend.entity.Enrollment;
import com.smartuni.backend.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {
    
    @Autowired
    private EnrollmentRepository repository;
    
    @GetMapping
    public List<Enrollment> get(Enrollment probe) {
        return repository.findAll(Example.of(probe));
    }
    
    @GetMapping("/{id}")
    public Enrollment getById(@PathVariable String id) {
        return repository.findById(id).orElse(null);
    }
    
    @PostMapping
    public Enrollment create(@RequestBody Enrollment entity) {
        if (entity.getId() == null || entity.getId().isEmpty()) {
            entity.setId(java.util.UUID.randomUUID().toString());
        }
        return repository.save(entity);
    }
    
    @PutMapping("/{id}")
    public Enrollment update(@PathVariable String id, @RequestBody Enrollment entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @PatchMapping("/{id}")
    public Enrollment patch(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Enrollment entity = repository.findById(id).orElse(null);
        if (entity == null) return null;
        
        org.springframework.util.ReflectionUtils.doWithFields(Enrollment.class, field -> {
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
