package com.smartuni.backend.controller;

import com.smartuni.backend.entity.ExamBatche;
import com.smartuni.backend.repository.ExamBatcheRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/examBatches")
public class ExamBatcheController {
    
    @Autowired
    private ExamBatcheRepository repository;
    
    @GetMapping
    public List<ExamBatche> get(ExamBatche probe) {
        return repository.findAll(Example.of(probe));
    }
    
    @GetMapping("/{id}")
    public ExamBatche getById(@PathVariable String id) {
        return repository.findById(id).orElse(null);
    }
    
    @PostMapping
    public ExamBatche create(@RequestBody ExamBatche entity) {
        if (entity.getId() == null || entity.getId().isEmpty()) {
            entity.setId(java.util.UUID.randomUUID().toString());
        }
        return repository.save(entity);
    }
    
    @PutMapping("/{id}")
    public ExamBatche update(@PathVariable String id, @RequestBody ExamBatche entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @PatchMapping("/{id}")
    public ExamBatche patch(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        ExamBatche entity = repository.findById(id).orElse(null);
        if (entity == null) return null;
        
        org.springframework.util.ReflectionUtils.doWithFields(ExamBatche.class, field -> {
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
