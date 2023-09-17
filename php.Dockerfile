
# Use the official PHP image with Apache
FROM php:7.4-apache

# Install PDO extension for MySQL (to connect with MariaDB)
RUN docker-php-ext-install pdo pdo_mysql

# Set the document root to /var/www/html/public
# This is where our entry point (index.php) will reside
ENV APACHE_DOCUMENT_ROOT /var/www/html

# Update the Apache configuration to set the document root
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Expose port 80
EXPOSE 80
