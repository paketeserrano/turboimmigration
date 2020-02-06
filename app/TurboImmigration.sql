DROP TABLE IF EXISTS `caseitem`;
DROP TABLE IF EXISTS `survey`;
DROP TABLE IF EXISTS `case`;
DROP TABLE IF EXISTS `user`;



/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(100) DEFAULT NULL,
  `username` varchar(200) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `access` varchar(200) DEFAULT NULL,
  `firstname` varchar(200) DEFAULT NULL,
  `lastname` varchar(200) DEFAULT NULL,
  `role` varchar(200) DEFAULT 'client',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `filecase` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`type` varchar(200) DEFAULT NULL,
	`clientid` int(11) NOT NULL,  
	`status` varchar(200) DEFAULT NULL,
	`ownerid` int(11) DEFAULT NULL,
	CONSTRAINT `ClientId_ibfk_1` FOREIGN KEY (`clientid`) REFERENCES `user` (`id`),
	CONSTRAINT `ClientId_ibfk_2` FOREIGN KEY (`ownerid`) REFERENCES `user` (`id`),  /* This is the person that works on the issue*/
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `survey` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(200) DEFAULT NULL,
	`caseid` int(11) DEFAULT NULL,  
	`config` text DEFAULT NULL,
	`status` varchar(200) DEFAULT NULL,
	`pdfpath` varchar(200) DEFAULT NULL, 
	CONSTRAINT `CaseId_ibfk_1` FOREIGN KEY (`caseid`) REFERENCES `filecase` (`id`),
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `caseitem` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(200) DEFAULT NULL,
	`caseid` int(11) DEFAULT NULL,  
	`status` varchar(200) DEFAULT NULL,
	`type` varchar(200) DEFAULT NULL, /* If it's a survey then surveyid field should be filled otherwise it will be null */
	CONSTRAINT `CaseId_ibfk_2` FOREIGN KEY (`caseid`) REFERENCES `filecase` (`id`),
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `stafffilecase` (
	`ownerid` int(11) NOT NULL,
	`filecaseid` int(11) NOT NULL,
	CONSTRAINT `stafffilecase_fk_1` FOREIGN KEY (`ownerid`) REFERENCES `user` (`id`),
	CONSTRAINT `stafffilecase_fk_2` FOREIGN KEY (`filecaseid`) REFERENCES `filecase` (`id`),
	UNIQUE KEY `unique_staff_filecase` (`ownerid`,`filecaseid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
