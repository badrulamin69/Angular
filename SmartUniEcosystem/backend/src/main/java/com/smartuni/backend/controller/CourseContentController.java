package com.smartuni.backend.controller;

import com.smartuni.backend.entity.CourseContent;
import com.smartuni.backend.repository.CourseContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/courseContent")
public class CourseContentController {
    
    @Autowired
    private CourseContentRepository repository;
    
    @GetMapping
    public List<CourseContent> get(CourseContent probe) {
        return repository.findAll(Example.of(probe));
    }
    
    @GetMapping("/{id}")
    public CourseContent getById(@PathVariable String id) {
        return repository.findById(id).orElse(null);
    }
    
    @PostMapping
    public CourseContent create(@RequestBody CourseContent entity) {
        if (entity.getId() == null || entity.getId().isEmpty()) {
            entity.setId(java.util.UUID.randomUUID().toString());
        }
        return repository.save(entity);
    }
    
    @PutMapping("/{id}")
    public CourseContent update(@PathVariable String id, @RequestBody CourseContent entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @PatchMapping("/{id}")
    public CourseContent patch(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        CourseContent entity = repository.findById(id).orElse(null);
        if (entity == null) return null;
        
        org.springframework.util.ReflectionUtils.doWithFields(CourseContent.class, field -> {
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
