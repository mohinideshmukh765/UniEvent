select * from users;
select * from colleges;
select * from event;
select * from afterpost;
select * from registration;

update afterpost set  likes=0 where event_id=7;
alter table afterpost add column likes int;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'colleges';

alter table registration drop column qrcode;
update users set college='KIT College Of Engineering' where username='mohini123';

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users';

SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
     ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'event';
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'event';

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'registration';

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'afterpost';


alter table users  drop column college_id;
alter table users  drop column college_code;
alter table users  add column college varchar(200);
ALTER TABLE public.afterpost ALTER COLUMN photo TYPE TEXT USING NULL;
ALTER TABLE public.event 
ADD COLUMN requires_name BOOLEAN DEFAULT TRUE,
ADD COLUMN requires_email BOOLEAN DEFAULT TRUE,
ADD COLUMN requires_college BOOLEAN DEFAULT TRUE,
ALTER TABLE public.event ADD COLUMN requires_phone BOOLEAN DEFAULT TRUE;

ADD COLUMN requires_payment BOOLEAN DEFAULT FALSE;


ALTER TABLE public.event 
ADD COLUMN qrcode_path VARCHAR(512),
ADD COLUMN photos_folder_path VARCHAR(512);


alter table registration add column reason varchar(500);

truncate table event CASCADE;