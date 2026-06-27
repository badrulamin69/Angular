package com.smartuni.backend.controller;

import com.smartuni.backend.entity.FacultySetting;
import com.smartuni.backend.repository.FacultySettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/facultySettings")
public class FacultySettingController {
    
    @Autowired
    private FacultySettingRepository repository;
    
    @GetMapping
    public List<FacultySetting> get(FacultySetting probe) {
        return repository.findAll(Example.of(probe));
    }
    
    @GetMapping("/{id}")
    public FacultySetting getById(@PathVariable String id) {
        return repository.findById(id).orElse(null);
    }
    
    @PostMapping
    public FacultySetting create(@RequestBody FacultySetting entity) {
        if (entity.getId() == null || entity.getId().isEmpty()) {
            entity.setId(java.util.UUID.randomUUID().toString());
        }
        return repository.save(entity);
    }
    
    @PutMapping("/{id}")
    public FacultySetting update(@PathVariable String id, @RequestBody FacultySetting entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @PatchMapping("/{id}")
    public FacultySetting patch(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        FacultySetting entity = repository.findById(id).orElse(null);
        if (entity == null) return null;
        
        org.springframework.util.ReflectionUtils.doWithFields(FacultySetting.class, field -> {
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
