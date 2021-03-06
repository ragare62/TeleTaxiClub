/*
SQLyog Community v11.4 (64 bit)
MySQL - 5.6.16 : Database - teletaxi_club
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
USE `teletaxi_club`;

/*Table structure for table `canjes` */

DROP TABLE IF EXISTS `canjes`;

CREATE TABLE `canjes` (
  `idCanje` int(11) NOT NULL AUTO_INCREMENT,
  `idMiembro` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `idPremio` int(11) DEFAULT NULL,
  `unidades` int(11) DEFAULT NULL,
  `puntos` int(11) DEFAULT NULL,
  `enCarro` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idCanje`),
  KEY `ref_miembro` (`idMiembro`),
  KEY `ref_premio` (`idPremio`),
  CONSTRAINT `ref_miembro` FOREIGN KEY (`idMiembro`) REFERENCES `miembro` (`idMiembro`),
  CONSTRAINT `ref_premio` FOREIGN KEY (`idPremio`) REFERENCES `premio` (`idPremio`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8;

/*Data for the table `canjes` */

insert  into `canjes`(`idCanje`,`idMiembro`,`fecha`,`idPremio`,`unidades`,`puntos`,`enCarro`) values (14,3,'2014-06-25 00:00:00',16,1,14,0);
insert  into `canjes`(`idCanje`,`idMiembro`,`fecha`,`idPremio`,`unidades`,`puntos`,`enCarro`) values (16,3,'2014-06-25 00:00:00',16,1,14,0);
insert  into `canjes`(`idCanje`,`idMiembro`,`fecha`,`idPremio`,`unidades`,`puntos`,`enCarro`) values (36,3,'2014-06-26 00:00:00',15,1,55,0);
insert  into `canjes`(`idCanje`,`idMiembro`,`fecha`,`idPremio`,`unidades`,`puntos`,`enCarro`) values (37,3,'2014-06-26 00:00:00',18,1,10,0);
insert  into `canjes`(`idCanje`,`idMiembro`,`fecha`,`idPremio`,`unidades`,`puntos`,`enCarro`) values (38,3,'2014-06-26 00:00:00',16,1,14,0);
insert  into `canjes`(`idCanje`,`idMiembro`,`fecha`,`idPremio`,`unidades`,`puntos`,`enCarro`) values (39,3,'2014-06-26 00:00:00',22,1,22,0);
insert  into `canjes`(`idCanje`,`idMiembro`,`fecha`,`idPremio`,`unidades`,`puntos`,`enCarro`) values (40,3,'2014-06-27 00:00:00',18,1,10,0);
insert  into `canjes`(`idCanje`,`idMiembro`,`fecha`,`idPremio`,`unidades`,`puntos`,`enCarro`) values (43,3,'2014-07-02 00:00:00',18,1,10,1);

/*Table structure for table `miembro` */

DROP TABLE IF EXISTS `miembro`;

CREATE TABLE `miembro` (
  `idMiembro` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `primerApellido` varchar(255) NOT NULL,
  `segundoApellido` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `codigoPostal` varchar(10) DEFAULT NULL,
  `poblacion` varchar(255) DEFAULT NULL,
  `provincia` varchar(255) DEFAULT NULL,
  `comunidad` varchar(255) DEFAULT NULL,
  `pais` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `telefono1` varchar(255) DEFAULT NULL,
  `telefono2` varchar(255) DEFAULT NULL,
  `telefono3` varchar(255) DEFAULT NULL,
  `telefono4` varchar(255) DEFAULT NULL,
  `telefono5` varchar(255) DEFAULT NULL,
  `fechaAlta` datetime DEFAULT NULL,
  PRIMARY KEY (`idMiembro`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COMMENT='Tabla que soporta la información de los miembros del club';

/*Data for the table `miembro` */

insert  into `miembro`(`idMiembro`,`nombre`,`primerApellido`,`segundoApellido`,`email`,`direccion`,`codigoPostal`,`poblacion`,`provincia`,`comunidad`,`pais`,`password`,`telefono1`,`telefono2`,`telefono3`,`telefono4`,`telefono5`,`fechaAlta`) values (1,'Juan','Gonzalez','Perez','alber@gmail.com','Calle del Caño 12','46017','Valencia','Valencia','Valencia',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2012-01-01 11:02:50');
insert  into `miembro`(`idMiembro`,`nombre`,`primerApellido`,`segundoApellido`,`email`,`direccion`,`codigoPostal`,`poblacion`,`provincia`,`comunidad`,`pais`,`password`,`telefono1`,`telefono2`,`telefono3`,`telefono4`,`telefono5`,`fechaAlta`) values (2,'Perico','Gonzalez','Perez','cd@gmail.com','Calle del Caño 12','4601723','Valencia','Valencia','Valencia','España',NULL,'66668889999','1452','3333','4444','5555','2010-01-01 11:02:50');
insert  into `miembro`(`idMiembro`,`nombre`,`primerApellido`,`segundoApellido`,`email`,`direccion`,`codigoPostal`,`poblacion`,`provincia`,`comunidad`,`pais`,`password`,`telefono1`,`telefono2`,`telefono3`,`telefono4`,`telefono5`,`fechaAlta`) values (3,'Rafael','Garcia','Redondo','ragare@gmail.com','XCalle del Caño 12','46017X','ValenciaX','ValenciaX','ValenciaX',NULL,'1234','663525578','963916753','9112245',NULL,NULL,'2012-01-01 11:02:50');
insert  into `miembro`(`idMiembro`,`nombre`,`primerApellido`,`segundoApellido`,`email`,`direccion`,`codigoPostal`,`poblacion`,`provincia`,`comunidad`,`pais`,`password`,`telefono1`,`telefono2`,`telefono3`,`telefono4`,`telefono5`,`fechaAlta`) values (6,'Aloma','Gander',NULL,'ced@gmail.com',NULL,NULL,NULL,NULL,NULL,NULL,'1234','963663480',NULL,NULL,NULL,NULL,'2012-01-01 11:02:50');
insert  into `miembro`(`idMiembro`,`nombre`,`primerApellido`,`segundoApellido`,`email`,`direccion`,`codigoPostal`,`poblacion`,`provincia`,`comunidad`,`pais`,`password`,`telefono1`,`telefono2`,`telefono3`,`telefono4`,`telefono5`,`fechaAlta`) values (7,'Aloma','Gander',NULL,'cd@gmail.com',NULL,NULL,NULL,NULL,NULL,NULL,'1234',NULL,NULL,NULL,NULL,NULL,'2012-01-01 11:02:50');
insert  into `miembro`(`idMiembro`,`nombre`,`primerApellido`,`segundoApellido`,`email`,`direccion`,`codigoPostal`,`poblacion`,`provincia`,`comunidad`,`pais`,`password`,`telefono1`,`telefono2`,`telefono3`,`telefono4`,`telefono5`,`fechaAlta`) values (10,'Rafael','Garcia',NULL,'rafa@myariadna.com',NULL,NULL,NULL,NULL,NULL,NULL,'rafa','696252512',NULL,NULL,NULL,NULL,NULL);
insert  into `miembro`(`idMiembro`,`nombre`,`primerApellido`,`segundoApellido`,`email`,`direccion`,`codigoPostal`,`poblacion`,`provincia`,`comunidad`,`pais`,`password`,`telefono1`,`telefono2`,`telefono3`,`telefono4`,`telefono5`,`fechaAlta`) values (11,'','',NULL,'ragare@gmail.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);

/*Table structure for table `premio` */

DROP TABLE IF EXISTS `premio`;

CREATE TABLE `premio` (
  `idPremio` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text,
  `puntos` int(11) NOT NULL,
  `desdeFecha` datetime DEFAULT NULL,
  `hastaFecha` datetime DEFAULT NULL,
  `stockInicial` int(11) DEFAULT NULL,
  `nombreFichero` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idPremio`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

/*Data for the table `premio` */

insert  into `premio`(`idPremio`,`titulo`,`descripcion`,`puntos`,`desdeFecha`,`hastaFecha`,`stockInicial`,`nombreFichero`) values (15,'Chaleco Amarillo','Un chaleco amarillo muy guay',6,'2014-06-12 00:00:00','2014-06-11 00:00:00',22,'entradas3.jpg');
insert  into `premio`(`idPremio`,`titulo`,`descripcion`,`puntos`,`desdeFecha`,`hastaFecha`,`stockInicial`,`nombreFichero`) values (16,'Torre HANOISx','El juego de las torres de Hanoi 7988798789',14,'2014-06-05 00:00:00','2014-06-27 00:00:00',20,'DeathtoStock_Wired2.jpg');
insert  into `premio`(`idPremio`,`titulo`,`descripcion`,`puntos`,`desdeFecha`,`hastaFecha`,`stockInicial`,`nombreFichero`) values (18,'TTEX5','Decripci de TTE',10,'2014-07-23 00:00:00','2014-08-01 00:00:00',10,'0010753344I-849x565.jpg');
insert  into `premio`(`idPremio`,`titulo`,`descripcion`,`puntos`,`desdeFecha`,`hastaFecha`,`stockInicial`,`nombreFichero`) values (22,'RE4539','registro 45',22,'2014-01-01 00:00:00','2014-12-31 00:00:00',30,'0002157477DD-849x565.jpg');
insert  into `premio`(`idPremio`,`titulo`,`descripcion`,`puntos`,`desdeFecha`,`hastaFecha`,`stockInicial`,`nombreFichero`) values (23,'Toquemo','Toquemo es un divertido juego infantil para toda la familia. Consíguelo ahora por solo 10 puntos',10,NULL,NULL,140,'freeimage-9478108-high.jpg');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
