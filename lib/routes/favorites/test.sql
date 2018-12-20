INSERT INTO favorite 
  (user_name, profile_id)
VALUES ($1, $2)
WHERE $1 NOT IN 
  (
    SELECT user_name
    FROM favorite
  )
RETURNING 
  id, 
  user_name,
  profile_id as "profileId";

NSERT
INTO    invoices (invoiceid, billed)
SELECT  '12345', 'TRUE'
WHERE   '12345' NOT IN
        (
        SELECT  invoiceid
        FROM    invoices
        )

INSERT INTO favorite(user_name, profile_id) 
  VALUES ($1, $2)
  SELECT $1, $2
  WHERE NOT EXISTS (
    SELECT 1 FROM favorite WHERE user_name=$1
);

      