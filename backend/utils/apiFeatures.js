class Features {
    constructor(query, queryStry) {
        this.query = query;
        this.queryStry = queryStry;
    }
    sort() {
        if (this.queryStry.sort) {
            const sortBy = this.queryStry.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this
    }
    filter() {
        const queryObj = { ...this.queryStry };

        // Fields to exclude from filtering
        const excludedFields = ["sort", "fields", "page", "limit"];
        excludedFields.forEach(field => delete queryObj[field]);

        // Convert query to MongoDB filter format
        let mongoQuery = {};

        for (const key in queryObj) {
            if (key.includes("[")) {
                // e.g., 'price[gte]' → ['price', 'gte']
                const [field, operator] = key.split(/\[|\]/).filter(Boolean);

                if (!mongoQuery[field]) mongoQuery[field] = {};

                mongoQuery[field][`$${operator}`] = isNaN(queryObj[key])
                    ? queryObj[key]
                    : parseFloat(queryObj[key]);

            } else {
                // Basic equality filter
                mongoQuery[key] = isNaN(queryObj[key])
                    ? queryObj[key]
                    : parseFloat(queryObj[key]);
            }
        }
        this.query = this.query.find(mongoQuery);
        return this;
    }
    limitFields() {
        if (this.queryStry.fields) {
            const fieldsBy = this.queryStry.fields.split(",").join(" ");
            this.query = this.query.select(fieldsBy)
        } else {
            this.query = this.query.select('-__v')
        }
    }
    paginate() {
        const page = parseInt(this.queryStry.page) || 1;
        const limit = parseInt(this.queryStry.limit) || 15;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = Features;
