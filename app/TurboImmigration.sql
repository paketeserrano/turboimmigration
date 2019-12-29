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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `case`;

CREATE TABLE `case` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`type` varchar(200) DEFAULT NULL,
	`clientid` int(11) NOT NULL,  
	CONSTRAINT `ClientId_ibfk_1` FOREIGN KEY (`clientid`) REFERENCES `user` (`id`),
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `survey` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(200) DEFAULT NULL,
	`caseid` int(11) DEFAULT NULL,  
	`config` text DEFAULT NULL,
	CONSTRAINT `CaseId_ibfk_1` FOREIGN KEY (`caseid`) REFERENCES `case` (`id`),
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `caseitem` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(200) DEFAULT NULL,
	`caseid` int(11) DEFAULT NULL,  
	`status` varchar(200) DEFAULT NULL,
	`type` varchar(200) DEFAULT NULL, /* If it's a survey then surveyid field should be filled otherwise it will be null */
	`surveyid` int(11) DEFAULT NULL,
	CONSTRAINT `SurveyId_ibfk_1` FOREIGN KEY (`surveyid`) REFERENCES `survey` (`id`),
	CONSTRAINT `CaseId_ibfk_2` FOREIGN KEY (`caseid`) REFERENCES `case` (`id`),
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
