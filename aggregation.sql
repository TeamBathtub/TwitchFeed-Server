select
    user_name,
    CAST(AVG(score) as int) as average
from rating
group by user_name;