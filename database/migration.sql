-- Fix negative stock first
UPDATE PRODUCTS SET stock = 0 WHERE stock < 0;
COMMIT;

-- Add new columns if they don't exist (using anonymous block to avoid errors if they exist, or just simple alter commands that might fail but we ignore)
-- Simpler approach for this environment:
ALTER TABLE PRODUCTS ADD category VARCHAR2(50);
ALTER TABLE PRODUCTS ADD last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add constraint
ALTER TABLE PRODUCTS ADD CONSTRAINT check_stock_non_negative CHECK (stock >= 0);

-- Update Procedure
CREATE OR REPLACE PROCEDURE PRC_AEDES_PRICING AS
BEGIN
    FOR r IN (SELECT id, base_price, stock, expiry_date, trend_score FROM PRODUCTS) LOOP
        DECLARE
            new_price NUMBER(10, 2);
            price_multiplier NUMBER(10, 4) := 1.0;
            days_until_expiry NUMBER;
        BEGIN
            days_until_expiry := r.expiry_date - SYSDATE;

            -- Logic 1: Expiry Decay
            IF days_until_expiry <= 0 THEN
                 price_multiplier := price_multiplier * 0.1; -- 90% off (Clearance)
            ELSIF days_until_expiry < 3 THEN
                 price_multiplier := price_multiplier * 0.7; -- 30% off
            END IF;

            -- Logic 2: Scarcity Surge
            IF r.stock < 10 THEN
                price_multiplier := price_multiplier * 1.15; -- 15% increase
            END IF;

            -- Logic 3: Trend/Demand Logic
            IF r.trend_score > 80 THEN
                price_multiplier := price_multiplier * 1.25; -- 25% Hype tax
            ELSIF r.trend_score < 20 THEN
                price_multiplier := price_multiplier * 0.95; -- 5% discount
            END IF;

            -- Calculate new price
            new_price := r.base_price * price_multiplier;

            -- Round to 2 decimal places
            new_price := ROUND(new_price, 2);

            -- Update the product
            UPDATE PRODUCTS
            SET current_price = new_price,
                last_updated = CURRENT_TIMESTAMP
            WHERE id = r.id;
        END;
    END LOOP;
    
    COMMIT;
END;
/
