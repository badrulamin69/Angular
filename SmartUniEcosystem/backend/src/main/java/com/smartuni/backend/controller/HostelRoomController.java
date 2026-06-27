package com.smartuni.backend.controller;

import com.smartuni.backend.entity.HostelRoom;
import com.smartuni.backend.repository.HostelRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hostelRooms")
public class HostelRoomController {
    
    @Autowired
    private HostelRoomRepository repository;
    
    @GetMapping
    public List<HostelRoom> get(HostelRoom probe) {
        return repository.findAll(Example.of(probe));
    }
    
    @GetMapping("/{id}")
    public HostelRoom getById(@PathVariable String id) {
        return repository.findById(id).orElse(null);
    }
    
    @PostMapping
    public HostelRoom create(@RequestBody HostelRoom entity) {
        if (entity.getId() == null || entity.getId().isEmpty()) {
            entity.setId(java.util.UUID.randomUUID().toString());
        }
        return repository.save(entity);
    }
    
    @PutMapping("/{id}")
    public HostelRoom update(@PathVariable String id, @RequestBody HostelRoom entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @PatchMapping("/{id}")
    public HostelRoom patch(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        HostelRoom entity = repository.findById(id).orElse(null);
        if (entity == null) return null;
        
        org.springframework.util.ReflectionUtils.doWithFields(HostelRoom.class, field -> {
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
