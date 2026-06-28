const fs = require('fs');
const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

const outDir = 'backend/src/main/java/com/smartuni/backend';

// Helper to singularize and capitalize
function toClassName(str) {
    if (str === 'studentGrades') return 'StudentGrade';
    if (str === 'staffProfiles') return 'StaffProfile';
    if (str === 'activityLogs') return 'ActivityLog';
    if (str === 'hostelRooms') return 'HostelRoom';
    if (str === 'studentResults') return 'StudentResult';
    if (str === 'systemStats') return 'SystemStat';
    if (str === 'pricingPlans') return 'PricingPlan';
    if (str === 'leaveRequests') return 'LeaveRequest';
    if (str === 'studentApplications') return 'StudentApplication';
    if (str === 'courseContent') return 'CourseContent';
    if (str === 'userProgress') return 'UserProgress';
    if (str === 'faculty-settings') return 'FacultySetting';
    if (str === 'facultySettings') return 'FacultySetting';
    if (str === 'financialRates') return 'FinancialRate';
    if (str === 'heroContent') return 'HeroContent';
    if (str.endsWith('ies')) return str.charAt(0).toUpperCase() + str.slice(1, -3) + 'y';
    if (str.endsWith('s')) return str.charAt(0).toUpperCase() + str.slice(1, -1);
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper to convert camelCase to snake_case
function toSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '').replace(/-/g, '_');
}

let sql = '';

Object.keys(db).forEach(collection => {
    if (collection === '$schema' || collection === 'faculty-settings') return;
    
    let isSingleObject = false;
    let records = db[collection];
    if (!Array.isArray(records)) {
        if (typeof records === 'object') {
            records = [records]; // wrap single object in array
            isSingleObject = true;
        } else {
            return;
        }
    }
    
    if (records.length === 0) return;
    
    const className = toClassName(collection);
    const tableName = toSnakeCase(collection);
    const firstObj = records[0];
    
    // Infer schema by scanning all records
    const fieldsMap = {};
    records.forEach(r => {
        Object.keys(r).forEach(key => {
            let val = r[key];
            if (!fieldsMap[key]) {
                fieldsMap[key] = { name: key, type: 'Integer', snake: toSnakeCase(key) };
            }
            if (typeof val === 'string' || typeof val === 'object') fieldsMap[key].type = 'String';
            else if (typeof val === 'number' && !Number.isInteger(val) && fieldsMap[key].type !== 'String') fieldsMap[key].type = 'Double';
            else if (typeof val === 'boolean' && fieldsMap[key].type !== 'String') fieldsMap[key].type = 'Boolean';
        });
    });
    
    if (!fieldsMap['id']) {
        fieldsMap['id'] = { name: 'id', type: 'String', snake: 'id' };
    } else {
        fieldsMap['id'].type = 'String'; // ID is always string
    }
    const fields = Object.values(fieldsMap);

    // 1. Generate Entity
    let entityCode = `package com.smartuni.backend.entity;\n\nimport jakarta.persistence.*;\nimport lombok.Data;\n\n@Data\n@Entity\n@Table(name = "\\"${tableName}\\"")\npublic class ${className} {\n`;
    fields.forEach(f => {
        if (f.name === 'id') {
            entityCode += `    @Id\n`;
        }
        entityCode += `    @Column(name = "\\"${f.snake}\\"", length = 5000)\n`;
        entityCode += `    private ${f.type} ${f.name};\n`;
    });
    entityCode += `}\n`;
    fs.writeFileSync(`${outDir}/entity/${className}.java`, entityCode);

    // 2. Generate Repository
    let repoCode = `package com.smartuni.backend.repository;\n\nimport com.smartuni.backend.entity.${className};\nimport org.springframework.data.jpa.repository.JpaRepository;\nimport org.springframework.stereotype.Repository;\n\n@Repository\npublic interface ${className}Repository extends JpaRepository<${className}, String> {\n}\n`;
    fs.writeFileSync(`${outDir}/repository/${className}Repository.java`, repoCode);

    // 3. Generate Controller
    let controllerCode = `package com.smartuni.backend.controller;\n\nimport com.smartuni.backend.entity.${className};\nimport com.smartuni.backend.repository.${className}Repository;\nimport org.springframework.beans.factory.annotation.Autowired;\nimport org.springframework.data.domain.Example;\nimport org.springframework.web.bind.annotation.*;\nimport java.util.List;\nimport java.util.Map;\n\n@RestController\n@RequestMapping("/${collection}")\npublic class ${className}Controller {\n    \n    @Autowired\n    private ${className}Repository repository;\n    \n`;
    
    if (isSingleObject) {
        controllerCode += `    @GetMapping\n    public ${className} get() {\n        List<${className}> list = repository.findAll();\n        return list.isEmpty() ? null : list.get(0);\n    }\n    \n    @PatchMapping\n    public ${className} patchRoot(@RequestBody Map<String, Object> updates) {\n        List<${className}> list = repository.findAll();\n        if (list.isEmpty()) return null;\n        return patch(list.get(0).getId(), updates);\n    }\n`;
    } else {
        controllerCode += `    @GetMapping\n    public List<${className}> get(${className} probe) {\n        return repository.findAll(Example.of(probe));\n    }\n`;
    }
    
    controllerCode += `    \n    @GetMapping("/{id}")\n    public ${className} getById(@PathVariable String id) {\n        return repository.findById(id).orElse(null);\n    }\n    \n    @PostMapping\n    public ${className} create(@RequestBody ${className} entity) {\n        if (entity.getId() == null || entity.getId().isEmpty()) {\n            entity.setId(java.util.UUID.randomUUID().toString());\n        }\n        return repository.save(entity);\n    }\n    \n    @PutMapping("/{id}")\n    public ${className} update(@PathVariable String id, @RequestBody ${className} entity) {\n        entity.setId(id);\n        return repository.save(entity);\n    }\n\n    @PatchMapping("/{id}")\n    public ${className} patch(@PathVariable String id, @RequestBody Map<String, Object> updates) {\n        ${className} entity = repository.findById(id).orElse(null);\n        if (entity == null) return null;\n        \n        org.springframework.util.ReflectionUtils.doWithFields(${className}.class, field -> {\n            if (updates.containsKey(field.getName())) {\n                field.setAccessible(true);\n                Object val = updates.get(field.getName());\n                if (val != null) {\n                    if (field.getType() == Integer.class && val instanceof Number) val = ((Number)val).intValue();\n                    if (field.getType() == Double.class && val instanceof Number) val = ((Number)val).doubleValue();\n                }\n                field.set(entity, val);\n            }\n        });\n        \n        return repository.save(entity);\n    }\n    \n    @DeleteMapping("/{id}")\n    public void delete(@PathVariable String id) {\n        repository.deleteById(id);\n    }\n}\n`;
    fs.writeFileSync(`${outDir}/controller/${className}Controller.java`, controllerCode);

    // 4. Append to SQL
    records.forEach(r => {
        let cols = [];
        let vals = [];
        fields.forEach(f => {
            cols.push(`"${f.snake}"`);
            let val = r[f.name];
            if (f.name === 'id' && (val === null || val === undefined)) {
                val = 'auto-' + Math.floor(Math.random() * 1000000);
            }
            if (val === null || val === undefined) {
                vals.push('NULL');
            } else if (f.type === 'String') {
                if (typeof val === 'object') val = JSON.stringify(val);
                vals.push(`'${String(val).replace(/'/g, "''")}'`);
            } else {
                vals.push(val);
            }
        });
        sql += `INSERT INTO "${tableName}" (${cols.join(', ')}) VALUES (${vals.join(', ')});\n`;
    });
});

fs.writeFileSync('backend/src/main/resources/data.sql', sql);
console.log('Backend generated successfully!');
