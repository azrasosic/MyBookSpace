-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: library_management
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `author`
--

DROP TABLE IF EXISTS `author`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `author` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `biography` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `author`
--

LOCK TABLES `author` WRITE;
/*!40000 ALTER TABLE `author` DISABLE KEYS */;
INSERT INTO `author` VALUES (25,'Stephen King','American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels. His books have sold more than 350 million copies.'),(26,'J.K. Rowling','British author, philanthropist, film producer, television producer, and screenwriter. Best known for writing the Harry Potter fantasy series.'),(27,'John Grisham','American novelist, attorney, politician, and activist best known for his popular legal thrillers. His books have been translated into 42 languages.'),(28,'Dan Brown','American author best known for his thriller novels, including the Robert Langdon series. His books have been translated into 57 languages.'),(29,'Haruki Murakami','Japanese writer. His novels, essays, and short stories have been bestsellers in Japan and internationally, translated into 50 languages.'),(30,'Isaac Asimov','American writer and professor of biochemistry, known for his works of science fiction and popular science. One of the \"Big Three\" science-fiction writers.'),(31,'Arthur C. Clarke','British science fiction writer, science writer, futurist, inventor, undersea explorer, and television series host. Co-writer of 2001: A Space Odyssey.'),(32,'Philip K. Dick','American novelist, short story writer, and essayist whose published work is almost entirely in the science fiction genre.'),(33,'Ursula K. Le Guin','American author best known for her works of speculative fiction, including science fiction works and the Earthsea fantasy series.'),(34,'Frank Herbert','American science fiction author best known for the 1965 novel Dune and its five sequels.'),(35,'J.R.R. Tolkien','English writer, poet, philologist, and academic, best known as the author of the high fantasy works The Hobbit and The Lord of the Rings.'),(36,'George R.R. Martin','American novelist and short story writer, screenwriter, and television producer. Best known for his epic fantasy series A Song of Ice and Fire.'),(37,'Terry Pratchett','English humorist, satirist, and author of fantasy novels, best known for his Discworld series of 41 novels.'),(38,'Brandon Sanderson','American fantasy and science fiction writer. Best known for the Cosmere universe and finishing Robert Jordan\'s epic fantasy series The Wheel of Time.'),(39,'Patrick Rothfuss','American writer of epic fantasy. Best known for his planned trilogy The Kingkiller Chronicle.'),(40,'Agatha Christie','English writer known for her 66 detective novels and 14 short story collections, particularly those revolving around fictional detectives Hercule Poirot and Miss Marple.'),(41,'Arthur Conan Doyle','British writer and physician, most noted for creating the fictional detective Sherlock Holmes.'),(42,'Gillian Flynn','American writer. Flynn has published three novels, which are all thrillers: Sharp Objects, Dark Places, and Gone Girl.'),(43,'Stieg Larsson','Swedish writer, journalist, and activist. Best known for writing the Millennium trilogy of crime novels.'),(44,'James Patterson','American author and philanthropist. Among his works are the Alex Cross, Michael Bennett, Women\'s Murder Club, Maximum Ride, Daniel X, NYPD Red, and Private series.'),(45,'Nora Roberts','American author of more than 225 romance novels. She writes as Nora Roberts for romance novels and as J.D. Robb for the In Death suspense series.'),(46,'Nicholas Sparks','American novelist, screenwriter, and film producer. He has published twenty-one novels and two non-fiction books.'),(47,'Jane Austen','English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century.'),(48,'Danielle Steel','American writer, best known for her romance novels. She is the bestselling author alive and the fourth bestselling fiction author of all time.'),(49,'Julia Quinn','American author of historical romance fiction. Her works have been translated into 41 languages and have appeared on The New York Times Bestseller List 19 times.'),(50,'H.P. Lovecraft','American writer of weird, science, fantasy, and horror fiction. He is best known for his creation of Cthulhu Mythos.'),(51,'Anne Rice','American author of gothic fiction, Christian literature, and erotica. She is best known for her series of novels The Vampire Chronicles.'),(52,'Clive Barker','English novelist, playwright, author, film director, and visual artist. Barker came to prominence in the mid-1980s with a series of short stories.'),(53,'Shirley Jackson','American writer, known primarily for her works of horror and mystery. Over the duration of her writing career, which spanned over two decades.'),(54,'Bram Stoker','Irish author, best known today for his 1897 Gothic horror novel Dracula.'),(55,'Walter Isaacson','American author, journalist, and professor. He has been the president and CEO of the Aspen Institute, a nonpartisan educational and policy studies organization.'),(56,'Ron Chernow','American writer, journalist, and biographer. He has written bestselling and award-winning biographies of historical figures from the world of business, finance, and politics.'),(57,'David McCullough','American author, narrator, popular historian, and lecturer. He is a two-time winner of the Pulitzer Prize and the National Book Award.'),(58,'Doris Kearns Goodwin','American biographer, historian, and political commentator. She has written biographies of several U.S. presidents.'),(59,'Jon Meacham','American writer, reviewer, historian and presidential biographer. He is a former executive editor and executive vice president at Random House.'),(60,'Howard Zinn','American historian, playwright, and social activist. He was a political science professor at Boston University.'),(61,'Barbara Tuchman','American historian and author. She won the Pulitzer Prize twice, for The Guns of August and Stilwell and the American Experience in China.'),(62,'Stephen Ambrose','American historian and biographer of U.S. Presidents Dwight D. Eisenhower and Richard Nixon. He was a longtime professor of history at the University of New Orleans.'),(63,'Erik Larson','American journalist and author of historical nonfiction. He has written six national bestsellers.'),(64,'Simon Schama','English historian specialising in art history, Dutch history, and French history. He is a University Professor of History and Art History at Columbia University.'),(65,'Maya Angelou','American poet, memoirist, and civil rights activist. She published seven autobiographies, three books of essays, several books of poetry.'),(66,'Robert Frost','American poet. His work was initially published in England before it was published in the United States.'),(67,'Emily Dickinson','American poet. Dickinson lived much of her life in reclusive isolation. While she was a prolific private poet, fewer than a dozen of her nearly 1,800 poems were published during her lifetime.'),(68,'Langston Hughes','American poet, social activist, novelist, playwright, and columnist from Joplin, Missouri.'),(69,'Pablo Neruda','Chilean poet-diplomat and politician who won the Nobel Prize for Literature in 1971.'),(70,'Dr. Seuss','American children\'s author, political cartoonist, illustrator, poet, animator, screenwriter, and filmmaker.'),(71,'Roald Dahl','British novelist, short-story writer, poet, screenwriter, and wartime fighter pilot. His books have sold more than 250 million copies worldwide.'),(72,'Beatrix Potter','English writer, illustrator, natural scientist, and conservationist. She is best known for her children\'s books featuring animals.'),(73,'Maurice Sendak','American illustrator and writer of children\'s books. He became widely known for his book Where the Wild Things Are, published in 1963.'),(74,'Lewis Carroll','English writer of children\'s fiction, notably Alice\'s Adventures in Wonderland and its sequel Through the Looking-Glass.'),(75,'Paulo Freire','Brazilian educator and philosopher who was a leading advocate of critical pedagogy.'),(76,'John Dewey','American philosopher, psychologist, and educational reformer whose ideas have been influential in education and social reform.'),(77,'Maria Montessori','Italian physician and educator best known for the philosophy of education that bears her name, and her writing on scientific pedagogy.'),(78,'Howard Gardner','American developmental psychologist and the John H. and Elisabeth A. Hobbs Research Professor of Cognition and Education at the Harvard Graduate School of Education.'),(79,'Ken Robinson','British author, speaker, and international advisor on education in the arts to government, non-profits, education, and arts bodies.'),(80,'William Shakespeare','English playwright, poet, and actor, widely regarded as the greatest writer in the English language and the world\'s greatest dramatist.'),(81,'Tennessee Williams','American playwright. Along with contemporaries Eugene O\'Neill and Arthur Miller, he is considered among the three foremost playwrights of 20th-century American drama.'),(82,'Arthur Miller','American playwright, essayist, and figure in twentieth-century American theater. Among his most popular plays are All My Sons, Death of a Salesman, The Crucible, and A View from the Bridge.'),(83,'Sophocles','One of three ancient Greek tragedians whose plays have survived. His first plays were written later than those of Aeschylus, and earlier than or contemporary with those of Euripides.'),(84,'Anton Chekhov','Russian playwright and short-story writer who is considered to be among the greatest writers of short fiction in history.'),(85,'Charles Dickens','English writer and social critic. He created some of the world\'s best-known fictional characters and is regarded by many as the greatest novelist of the Victorian era.'),(86,'Mark Twain','American writer, humorist, entrepreneur, publisher, and lecturer. He was lauded as the \"greatest humorist the United States has produced\".'),(87,'Fyodor Dostoevsky','Russian novelist, short story writer, essayist, journalist and philosopher. His literary works explore human psychology in the troubled political, social, and spiritual atmospheres of 19th-century Russia.'),(88,'Leo Tolstoy','Russian writer who is regarded as one of the greatest authors of all time. He received nominations for the Nobel Prize in Literature every year from 1902 to 1906.'),(89,'Herman Melville','American novelist, short story writer, and poet of the American Renaissance period. Best known for his whaling novel Moby-Dick.');
/*!40000 ALTER TABLE `author` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book`
--

DROP TABLE IF EXISTS `book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `author_id` int NOT NULL,
  `ISBN` varchar(20) NOT NULL,
  `publication_year` smallint DEFAULT NULL,
  `genre` enum('Fiction','Sci-Fi','Fantasy','Mystery','Romance','Horror','Biography','History','Poetry','Children','Education','Drama','Classic') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `summary` text,
  `status` enum('Available','Borrowed') DEFAULT 'Available',
  `image_url` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ISBN` (`ISBN`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `book_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `author` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book`
--

LOCK TABLES `book` WRITE;
/*!40000 ALTER TABLE `book` DISABLE KEYS */;
INSERT INTO `book` VALUES (28,'The Stand',25,'978-0385121684',1978,'Fiction','A post-apocalyptic dark fantasy novel about a pandemic of a weaponized strain of influenza that kills almost the entire world population.','Available','https://imgur.com/Si50oh7.jpg'),(29,'The Shining',25,'978-0385121671',1977,'Fiction','A horror novel about a family\'s winter at an isolated hotel where the father is influenced by supernatural forces.','Borrowed','https://imgur.com/79Fv8Lo.jpg'),(30,'Harry Potter and the Sorcerer\'s Stone',26,'978-0590353427',1997,'Fiction','The first novel in the Harry Potter series following Harry Potter, a young wizard who discovers his magical heritage.','Available','https://imgur.com/eOztqQv.jpg'),(31,'The Firm',27,'978-0385415805',1991,'Fiction','A legal thriller about a young lawyer who joins a firm that is not what it appears to be.','Available','https://imgur.com/D3UYeWR.jpg'),(32,'Angels & Demons',28,'978-0671027360',2000,'Fiction','A mystery-thriller novel following Robert Langdon as he tries to stop a terrorist organization from destroying Vatican City.','Borrowed','https://imgur.com/1u9tXw1.jpg'),(33,'Norwegian Wood',29,'978-0375704024',1987,'Fiction','A nostalgic story of loss and burgeoning sexuality set in Tokyo during the late 1960s.','Borrowed','https://imgur.com/m0lijq7.jpg'),(34,'Carrie',25,'978-0385086950',1974,'Fiction','A horror novel about a teenage girl with telekinetic powers who is bullied by her peers and dominated by her religious mother.','Available','https://imgur.com/ZzSz9gL.jpg'),(35,'The Casual Vacancy',26,'978-0316228534',2012,'Fiction','A novel about a parish council election in the small English town of Pagford.','Available','https://imgur.com/7i0TsNE.jpg'),(36,'The Pelican Brief',27,'978-0385418233',1992,'Fiction','A legal thriller about a law student who uncovers a conspiracy while investigating the assassinations of two Supreme Court justices.','Available','https://imgur.com/kFLBfhu.jpg'),(37,'The Da Vinci Code',28,'978-0307474278',2003,'Fiction','A mystery thriller novel that follows symbologist Robert Langdon as he investigates a murder in Paris\' Louvre Museum.','Available','https://imgur.com/xc6EoHN.jpg'),(38,'Foundation',30,'978-0553293357',1951,'Sci-Fi','The first novel in Isaac Asimov\'s Foundation series, depicting the fall of a vast interstellar empire and the attempt to shorten the ensuing dark age.','Available','https://imgur.com/y6ZiOs1.jpg'),(39,'I, Robot',30,'978-0553294385',1950,'Sci-Fi','A collection of nine science fiction short stories by Isaac Asimov, examining the interaction of humans and robots.','Available','https://imgur.com/Tufa3tj.jpg'),(40,'2001: A Space Odyssey',31,'978-0451457998',1968,'Sci-Fi','A science fiction novel about a voyage to Jupiter with the sentient computer HAL after the discovery of a mysterious monolith.','Available','https://imgur.com/baiy9f2.jpg'),(41,'Do Androids Dream of Electric Sheep?',32,'978-0345404473',1968,'Sci-Fi','A post-apocalyptic science fiction novel set in a future Earth following World War Terminus.','Available','https://imgur.com/kWuKFza.jpg'),(42,'The Left Hand of Darkness',33,'978-0441478125',1969,'Sci-Fi','A science fiction novel set in the fictional Hainish universe, dealing with themes of gender and sexuality on a planet where inhabitants can change gender.','Available','https://imgur.com/k4th35e.jpg'),(43,'Dune',34,'978-0441172719',1965,'Sci-Fi','A science fiction novel set in the distant future amidst a feudal interstellar society.','Available','https://imgur.com/YA15fI0.jpg'),(44,'The Gods Themselves',30,'978-0553288100',1972,'Sci-Fi','A science fiction novel dealing with themes of alien sexuality and parallel universes.','Available','https://imgur.com/pRmlaIQ.jpg'),(45,'Rendezvous with Rama',31,'978-0553287899',1973,'Sci-Fi','A science fiction novel about a mysterious alien spacecraft that enters the Solar System.','Available','https://imgur.com/HUP5yuI.jpg'),(46,'Ubik',32,'978-0547572298',1969,'Sci-Fi','A science fiction novel by Philip K. Dick set in a future where psychic powers are common.','Available','https://imgur.com/DHoX5h9.jpg'),(47,'The Dispossessed',33,'978-0060512750',1974,'Sci-Fi','An anarchist utopian science fiction novel set in the fictional Hainish universe.','Available','https://imgur.com/eVtZxeO.jpg'),(48,'The Hobbit',35,'978-0618260300',1937,'Fantasy','A fantasy novel about the adventures of hobbit Bilbo Baggins in Middle-earth.','Available','https://imgur.com/dPLqBy6.jpg'),(49,'The Fellowship of the Ring',35,'978-0618346257',1954,'Fantasy','The first volume of The Lord of the Rings, following the journey of Frodo Baggins to destroy the One Ring.','Available','https://imgur.com/ICgGaUY.jpg'),(50,'A Game of Thrones',36,'978-0553103540',1996,'Fantasy','The first novel in A Song of Ice and Fire series, set in the fictional continents of Westeros and Essos.','Available','https://imgur.com/I4HTvYL.jpg'),(51,'Good Omens',37,'978-0060853983',1990,'Fantasy','A comedy about the birth of the son of Satan and the coming of the End Times.','Available','https://imgur.com/gKm39cr.jpg'),(52,'The Way of Kings',38,'978-0765326355',2010,'Fantasy','The first book in The Stormlight Archive series, set on the world of Roshar.','Available','https://imgur.com/vjDR2Sv.jpg'),(53,'The Name of the Wind',39,'978-0756404741',2007,'Fantasy','The first book in The Kingkiller Chronicle, following the life of Kvothe, a legendary musician and adventurer.','Available','https://imgur.com/41UGqYy.jpg'),(54,'The Two Towers',35,'978-0618346264',1954,'Fantasy','The second volume of The Lord of the Rings, continuing the journey to destroy the One Ring.','Available','https://imgur.com/RB5v0aN.jpg'),(55,'A Clash of Kings',36,'978-0553108033',1998,'Fantasy','The second novel in A Song of Ice and Fire, continuing the War of the Five Kings.','Available','https://imgur.com/a2WtiSc.jpg'),(56,'Mort',37,'978-0061020681',1987,'Fantasy','A Discworld novel about Death taking on an apprentice.','Available','https://imgur.com/FKOZZRi.jpg'),(57,'Words of Radiance',38,'978-0765326362',2014,'Fantasy','The second book in The Stormlight Archive, continuing the story on Roshar.','Available','https://imgur.com/ocfhVbB.jpg'),(58,'Murder on the Orient Express',40,'978-0062693662',1934,'Mystery','A detective novel in which Hercule Poirot investigates a murder on the luxurious Orient Express train.','Available','https://imgur.com/UHsIzEs.jpg'),(59,'And Then There Were None',40,'978-0312330873',1939,'Mystery','A mystery novel about ten people who are invited to an isolated island and are killed one by one.','Available','https://imgur.com/X0xwV4l.jpg'),(60,'The Hound of the Baskervilles',41,'978-0199536965',1902,'Mystery','A detective novel featuring Sherlock Holmes investigating the death of Sir Charles Baskerville.','Available','https://imgur.com/MTG01Do.jpg'),(61,'Gone Girl',42,'978-0307588371',2012,'Mystery','A psychological thriller about the disappearance of a woman on her fifth wedding anniversary.','Available','https://imgur.com/9cBQDgK.jpg'),(62,'The Girl with the Dragon Tattoo',43,'978-0307454546',2005,'Mystery','A psychological thriller novel about a journalist and a hacker investigating a wealthy family.','Available','https://imgur.com/qzlOWbm.jpg'),(63,'Along Came a Spider',44,'978-0446692636',1993,'Mystery','The first novel in the Alex Cross series about a detective hunting a serial killer.','Available','https://imgur.com/EsrrzdU.jpg'),(64,'The ABC Murders',40,'978-0062073563',1936,'Mystery','A detective novel in which Hercule Poirot investigates a series of murders committed in alphabetical order.','Available','https://imgur.com/wytD1Od.jpg'),(65,'The Adventures of Sherlock Holmes',41,'978-0199536958',1892,'Mystery','A collection of twelve short stories featuring Sherlock Holmes and Dr. Watson.','Available','https://imgur.com/mAkuKh8.jpg'),(66,'Vision in White',45,'978-0425228293',2009,'Romance','The first book in the Bride Quartet series about four friends who run a wedding planning business.','Available','https://imgur.com/gpEajCu.jpg'),(67,'The Notebook',46,'978-0446605239',1996,'Romance','A romantic novel about a poor young man who falls in love with a rich young woman.','Available','https://imgur.com/xaxfUVe.jpg'),(68,'Pride and Prejudice',47,'978-0141439518',1813,'Romance','A romantic novel of manners that follows the emotional development of Elizabeth Bennet.','Available','https://imgur.com/duUQjQk.jpg'),(69,'The Promise',48,'978-0440241906',1978,'Romance','A romance novel about a young woman who falls in love with a doctor.','Available','https://imgur.com/89QkSTF.jpg'),(70,'The Duke and I',49,'978-0380800827',2000,'Romance','The first novel in the Bridgerton series about the romantic adventures of the Bridgerton family.','Available','https://imgur.com/Wht5WIF.jpg'),(71,'It Ends with Us',46,'978-1501110368',2016,'Romance','A romance novel about a woman who falls in love with a neurosurgeon.','Available','https://imgur.com/SF9nNw9.jpg\r\n\r\n'),(72,'Message in a Bottle',46,'978-0446672216',1998,'Romance','A romance novel about a woman who finds a love letter in a bottle.','Available','https://imgur.com/W2J3Ggo.jpg'),(73,'Sense and Sensibility',47,'978-0141439662',1811,'Romance','A novel about the Dashwood sisters, Elinor and Marianne, as they come of age.','Available','https://imgur.com/n4DvdiS.jpg'),(74,'The Call of Cthulhu',50,'978-1512390664',1928,'Horror','A short story about the Cthulhu Mythos, describing a monstrous creature that lies dormant beneath the sea.','Available','https://imgur.com/ecp8lKP.jpg'),(75,'Interview with the Vampire',51,'978-0345476876',1976,'Horror','A gothic horror and vampire novel about a vampire named Louis de Pointe du Lac.','Available','https://imgur.com/hliO4pl.jpg'),(76,'Books of Blood',52,'978-0425074111',1984,'Horror','A collection of horror short stories by Clive Barker.','Available','https://imgur.com/cFI7TgC.jpg'),(77,'The Haunting of Hill House',53,'978-0143134770',1959,'Horror','A Gothic horror novel about four people who stay in a haunted house for a supernatural study.','Available','https://imgur.com/Nm0Zn4e.jpg'),(78,'Dracula',54,'978-0486411095',1897,'Horror','An epistolary Gothic horror novel about Count Dracula\'s attempt to move from Transylvania to England.','Available','https://imgur.com/8Wn90D1.jpg'),(79,'The Exorcist',54,'978-0061007224',1971,'Horror','A horror novel about the demonic possession of a young girl and her mother\'s attempt to rescue her through an exorcism.','Available','https://imgur.com/WQ7dI6o.jpg'),(80,'Pet Sematary',25,'978-0671685638',1983,'Horror','A horror novel about a family that discovers a mysterious burial ground with resurrective powers.','Available','https://imgur.com/WzpbzpX.jpg'),(81,'The Silence of the Lambs',54,'978-0312924584',1988,'Horror','A psychological horror novel about an FBI trainee who seeks the advice of an imprisoned serial killer.','Available','https://imgur.com/LXXAlKH.jpg'),(82,'Steve Jobs',55,'978-1451648539',2011,'Biography','A biography of Apple co-founder Steve Jobs based on more than forty interviews with Jobs.','Available','https://imgur.com/2i0e6Hv.jpg'),(83,'Alexander Hamilton',56,'978-0143034759',2004,'Biography','A biography of American Founding Father Alexander Hamilton.','Available','https://imgur.com/sIsGR5l.jpg'),(84,'John Adams',57,'978-0743223133',2001,'Biography','A biography of John Adams, the second President of the United States.','Available','https://imgur.com/yBYdcK3.jpg'),(85,'Team of Rivals',58,'978-0743270755',2005,'Biography','A biography of Abraham Lincoln focusing on his presidency and his cabinet.','Available','https://imgur.com/owNL2ee.jpg'),(86,'Thomas Jefferson: The Art of Power',59,'978-0812979480',2012,'Biography','A biography of Thomas Jefferson focusing on his political career.','Available','https://imgur.com/JrDIw3W.jpg'),(87,'Einstein: His Life and Universe',55,'978-0743264730',2007,'Biography','A biography of Albert Einstein exploring his scientific achievements and personal life.','Available','https://imgur.com/3be5tj8.jpg'),(88,'Churchill: Walking with Destiny',59,'978-0812997170',2018,'Biography','A biography of Winston Churchill focusing on his leadership during World War II.','Available','https://imgur.com/1gFUTbW.jpg'),(89,'Benjamin Franklin: An American Life',55,'978-0743258074',2003,'Biography','A biography of Benjamin Franklin exploring his life as a scientist, inventor, and statesman.','Available','https://imgur.com/eFQn5Bx.jpg'),(90,'A People\'s History of the United States',60,'978-0062397348',1980,'History','A history of the United States told from the perspective of marginalized groups.','Available','https://imgur.com/Gdpxulc.jpg'),(91,'The Guns of August',61,'978-0345476098',1962,'History','A history of the first month of World War I.','Available','https://imgur.com/mxwwv7R.jpg'),(92,'Band of Brothers',62,'978-0743224543',1992,'History','A history of Easy Company, 506th Parachute Infantry Regiment, 101st Airborne Division during World War II.','Available','https://imgur.com/7mTOJZb.jpg'),(93,'The Devil in the White City',63,'978-0375725609',2003,'History','A historical non-fiction book about the 1893 World\'s Columbian Exposition in Chicago.','Available','https://imgur.com/5DuEgmg.jpg'),(94,'Citizens: A Chronicle of the French Revolution',64,'978-0679726104',1989,'History','A history of the French Revolution from its beginnings to the rise of Napoleon.','Available','https://imgur.com/VYVYjhU.jpg'),(95,'1776',57,'978-0743226714',2005,'History','A history of the American Revolution focusing on the year 1776.','Available','https://imgur.com/B56w1bc.jpg'),(96,'The Wright Brothers',57,'978-1476728742',2015,'History','A biography of the Wright brothers and their invention of the airplane.','Available','https://imgur.com/oPQ4RLW.jpg'),(97,'The Cold War: A New History',64,'978-0143038276',2005,'History','A history of the Cold War from its origins to its end.','Available','https://imgur.com/udASK7o.jpg'),(98,'I Know Why the Caged Bird Sings',65,'978-0345514400',1969,'Poetry','A collection of poems by Maya Angelou exploring themes of identity, racism, and resilience.','Available','https://imgur.com/9QP1Mx9.jpg'),(99,'The Road Not Taken',66,'978-0805069830',1916,'Poetry','A collection of poems by Robert Frost including the famous title poem.','Available','https://imgur.com/2ZdZ5yf.jpg'),(100,'The Complete Poems of Emily Dickinson',67,'978-0316184137',1955,'Poetry','A complete collection of Emily Dickinson\'s poems.','Available','https://imgur.com/EyVLOou.jpg'),(101,'The Collected Poems of Langston Hughes',68,'978-0679764083',1994,'Poetry','A collection of poems by Langston Hughes exploring African American life.','Available','https://imgur.com/aJXv6Sq.jpg'),(102,'Twenty Love Poems and a Song of Despair',69,'978-0143039969',1924,'Poetry','A collection of love poems by Pablo Neruda.','Available','https://imgur.com/CgblnnM.jpg'),(103,'The Waste Land',66,'978-0156948772',1922,'Poetry','A long poem by T.S. Eliot considered one of the most important poems of the 20th century.','Available','https://imgur.com/qI5j01p.jpg'),(104,'Leaves of Grass',68,'978-0451529732',1855,'Poetry','A collection of poems by Walt Whitman celebrating nature, democracy, and the individual.','Available','https://imgur.com/7qEBth3.jpg'),(106,'The Cat in the Hat',70,'978-0394800011',1957,'Children','A children\'s book about a cat who visits two children on a rainy day.','Available','https://imgur.com/lb0hHwA.jpg'),(107,'Charlie and the Chocolate Factory',71,'978-0142410318',1964,'Children','A children\'s novel about a poor boy who wins a tour of a chocolate factory.','Available','https://imgur.com/T3YRsqM.jpg'),(108,'The Tale of Peter Rabbit',72,'978-0723247708',1902,'Children','A children\'s book about a mischievous rabbit who disobeys his mother.','Available','https://imgur.com/B8e9wJk.jpg'),(109,'Where the Wild Things Are',73,'978-0060254926',1963,'Children','A children\'s picture book about a boy named Max who travels to a land of wild creatures.','Available','https://imgur.com/8eFS9h3.jpg'),(110,'Alice\'s Adventures in Wonderland',74,'978-1503222687',1865,'Children','A children\'s novel about a girl who falls down a rabbit hole into a fantasy world.','Available','https://imgur.com/aufskiX.jpg'),(111,'Green Eggs and Ham',70,'978-0394800165',1960,'Children','A children\'s book about Sam-I-am trying to convince someone to try green eggs and ham.','Available','https://imgur.com/KNPlQ73.jpg'),(112,'Matilda',71,'978-0142410370',1988,'Children','A children\'s novel about a gifted girl with telekinetic powers.','Available','https://imgur.com/zFbYIr6.jpg'),(113,'The Very Hungry Caterpillar',73,'978-0399226908',1969,'Children','A children\'s picture book about a caterpillar who eats his way through various foods.','Available','https://imgur.com/vgk0WSD.jpg');
/*!40000 ALTER TABLE `book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `borrowing`
--

DROP TABLE IF EXISTS `borrowing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `borrowing` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `user_id` int NOT NULL,
  `librarian_id` int NOT NULL,
  `borrow_date` date NOT NULL,
  `due_date` date NOT NULL,
  `return_date` date DEFAULT NULL,
  `status` enum('Active','Returned','Overdue') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Active',
  PRIMARY KEY (`id`),
  KEY `book_id` (`book_id`),
  KEY `user_id` (`user_id`),
  KEY `librarian_id` (`librarian_id`),
  CONSTRAINT `borrowing_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`) ON DELETE CASCADE,
  CONSTRAINT `borrowing_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `borrowing_ibfk_3` FOREIGN KEY (`librarian_id`) REFERENCES `librarian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `borrowing`
--

LOCK TABLES `borrowing` WRITE;
/*!40000 ALTER TABLE `borrowing` DISABLE KEYS */;
INSERT INTO `borrowing` VALUES (33,43,12,9,'2025-12-01','2025-12-14','2025-12-03','Returned'),(34,61,13,9,'2025-12-01','2025-12-14','2025-12-03','Returned'),(35,68,15,20,'2025-12-01','2025-12-14','2025-12-03','Returned'),(36,107,16,21,'2025-12-02','2025-12-15','2025-12-04','Returned'),(37,102,17,21,'2025-12-02','2025-12-15','2025-12-04','Returned'),(38,94,18,22,'2025-12-02','2025-12-15','2025-12-04','Returned'),(39,73,19,9,'2025-12-03','2025-12-16','2025-12-05','Returned'),(40,77,20,9,'2025-12-03','2025-12-16','2025-12-05','Returned'),(41,87,12,20,'2025-12-03','2025-12-16','2025-12-05','Returned'),(42,43,13,20,'2025-12-03','2025-12-16','2025-12-05','Returned'),(43,104,15,20,'2025-12-03','2025-12-16','2025-12-05','Returned'),(44,97,18,21,'2025-12-04','2025-12-17','2025-12-07','Returned'),(45,68,17,22,'2025-12-04','2025-12-17','2025-12-07','Returned'),(46,108,16,22,'2025-12-06','2025-12-20','2025-12-14','Returned'),(47,77,15,20,'2025-12-10','2025-12-24','2025-12-13','Returned'),(48,28,17,9,'2025-11-10','2025-11-24','2025-12-27','Returned'),(49,32,19,21,'2025-12-14','2025-12-28',NULL,'Active'),(50,33,13,9,'2025-12-14','2025-12-28',NULL,'Active'),(51,29,18,9,'2025-12-14','2025-12-28',NULL,'Active');
/*!40000 ALTER TABLE `borrowing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `librarian`
--

DROP TABLE IF EXISTS `librarian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `librarian` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `employment_date` date NOT NULL,
  `role` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `librarian`
--

LOCK TABLES `librarian` WRITE;
/*!40000 ALTER TABLE `librarian` DISABLE KEYS */;
INSERT INTO `librarian` VALUES (9,'Azra','Mulagić','azra.m@mybookspace.com','+387603396812','2003-12-27','$2y$10$gcdUrNFSBwbKJ8ax8/XqSuhYMlZvgBT2g0RfyPuhwSCe9tS07TuCG','2024-01-15','librarian'),(20,'Adnan','Mulagić','adnan.m@mybookspace.com','+38761977483','1990-02-17','$2y$10$A0h5/Ve49JvMsU2Uoa9a/.rCx77sYvSBNYatUooTdErhGDGsWZgQm','2025-12-14','librarian'),(21,'Samra','Šehić','samra.s@mybookspace.com','+38762342817','1999-08-08','$2y$10$U/q1wmxOfwaFxxVlZ5IzaOchzXvfzf.m5ZFhbSgyGYbQgkjjXGvni','2025-12-14','librarian'),(22,'Adna','Čičko','adna.c@mybookspace.com','+387603332702','2004-07-20','$2y$10$QrR7uqjsrffPAn3ho78H1eXDDVUETHUKyuVESxA7r8biVRryiMicy','2025-12-14','librarian');
/*!40000 ALTER TABLE `librarian` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `date_joined` date NOT NULL,
  `role` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (12,'Haris','Imamović','haris@gmail.com','+38761222333','1990-05-15','$2y$10$DiVkSx.uoTfwz6iKgiAnmerqtvGzYwFXQDa5DQSsAjWCfL0vRD9G2','2025-12-08','user'),(13,'Ajdin','Šehić','ajdin@gmail.com','+38762691084','1996-08-09','$2y$10$4lAqCWMhfDBMI8HYfmxzBOJxSB5ekY1AhtCP9RZB9PDce1v9aIGZy','2025-12-08','user'),(15,'Ajla','Pehlivan','ajla@gmail.com','+38765026352','2003-10-04','$2y$10$XiJwG/6iLaBZgy18wIcoDOgVEdR7lXylH6Rbog6E06NpVCJzzS6X6','2025-12-08','user'),(16,'Aiša','Šošić','aisa@gmail.com','+38761950866','2011-09-22','$2y$10$pHo65XkjaE7lFmdtUru4quuhjkcn27ohHZ9htSGW4ZgWLfWevzhHa','2025-12-14','user'),(17,'Nasiha','Šošić','nasiha@gmail.com','+38761983746','1978-05-29','$2y$10$UDQENBK5yaGO7qL85QaqdeDh/0PgQRLYTXQx2tsUSkih4NCLZQ66a','2025-12-14','user'),(18,'Admir','Šošić','admir@gmail.com','+38762963772','1975-08-17','$2y$10$tuMdHjiK0SopcNssV0q.9uXZtQprsrwiLk2TPKlzblZ3Dya8WvRwu','2025-12-14','user'),(19,'Džejla','Čiko','dzejla@gmail.com','+38762876311','2003-09-24','$2y$10$EgQTghjxRXIJtquLYA5nQe8SdzbZcD3/eEdZ6d/xll/s.JukIgG.W','2025-12-14','user'),(20,'Hana','Sejmenović','hana@gmail.com','+38761467306','2004-07-21','$2y$10$Byf1HqlbXFYT4YUyu8Bsve/apSCWkACn8uuGy3nqD1SjVjiS/c65O','2025-12-14','user');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'library_management'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-28 15:40:25
