package com.smartuni.backend.controller;

import com.smartuni.backend.entity.HeroContent;
import com.smartuni.backend.repository.HeroContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/heroContent")
public class HeroContentController {
    
    @Autowired
    private HeroContentRepository repository;
    
    @GetMapping
    public List<HeroContent> get(HeroContent probe) {
        return repository.findAll(Example.of(probe));
    }
    
    @GetMapping("/{id}")
    public HeroContent getById(@PathVariable String id) {
        return repository.findById(id).orElse(null);
    }
    
    @PostMapping
    public HeroContent create(@RequestBody HeroContent entity) {
        if (entity.getId() == null || entity.getId().isEmpty()) {
            entity.setId(java.util.UUID.randomUUID().toString());
        }
        return repository.save(entity);
    }
    
    @PutMapping("/{id}")
    public HeroContent update(@PathVariable String id, @RequestBody HeroContent entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @PatchMapping("/{id}")
    public HeroContent patch(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        HeroContent entity = repository.findById(id).orElse(null);
        if (entity == null) return null;
        
        org.springframework.util.ReflectionUtils.doWithFields(HeroContent.class, field -> {
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
