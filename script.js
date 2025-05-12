// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.mobile-menu')) {
            navLinks.classList.remove('active');
        }
    });

    // ============== NEW FEATURE: Sticky Header ==============
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('sticky');
            
            // Hide on scroll down, show on scroll up
            if (scrollTop > lastScrollTop) {
                header.style.top = '-100px';
            } else {
                header.style.top = '0';
            }
        } else {
            header.classList.remove('sticky');
        }
        
        lastScrollTop = scrollTop;
    });

    // ============== NEW FEATURE: Reading Time Estimator ==============
    const articles = document.querySelectorAll('.post-content');
    
    articles.forEach(article => {
        // Only run on individual post pages
        if (article.querySelector('.post-full-content')) {
            const content = article.querySelector('.post-full-content').textContent;
            const wordCount = content.split(/\s+/).length;
            // Average reading speed: 200 words per minute
            const readingTime = Math.ceil(wordCount / 200);
            
            // Create reading time element
            const readingTimeEl = document.createElement('span');
            readingTimeEl.innerHTML = `<i class="far fa-clock"></i> ${readingTime} min read`;
            readingTimeEl.className = 'reading-time';
            
            // Insert after post meta
            const postMeta = article.querySelector('.post-meta');
            if (postMeta) {
                postMeta.appendChild(readingTimeEl);
            }
        }
    });

    // Newsletter Form Validation and Submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            const messageEl = document.getElementById('newsletter-message');
            
            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (emailRegex.test(emailInput.value)) {
                // Success message
                messageEl.textContent = 'Thank you for subscribing!';
                messageEl.style.color = '#2ecc71';
                emailInput.value = '';
                
                // Store in localStorage
                const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
                subscribers.push({
                    email: emailInput.value,
                    date: new Date().toISOString()
                });
                localStorage.setItem('subscribers', JSON.stringify(subscribers));
                
                // Simulate form submission
                console.log('Newsletter form submitted with email:', emailInput.value);
            } else {
                // Error message
                messageEl.textContent = 'Please enter a valid email address.';
                messageEl.style.color = '#e74c3c';
            }
        });
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            let isValid = true;
            
            // Get all form inputs
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            
            // Clear previous error messages
            document.querySelectorAll('.error-message').forEach(el => {
                el.style.display = 'none';
            });
            
            // Validate name
            if (name.value.trim() === '') {
                document.getElementById('name-error').style.display = 'block';
                isValid = false;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                document.getElementById('email-error').style.display = 'block';
                isValid = false;
            }
            
            // Validate subject
            if (subject.value.trim() === '') {
                document.getElementById('subject-error').style.display = 'block';
                isValid = false;
            }
            
            // Validate message
            if (message.value.trim() === '') {
                document.getElementById('message-error').style.display = 'block';
                isValid = false;
            }
            
            // Prevent form submission if validation fails
            if (!isValid) {
                e.preventDefault();
            } else {
                // Store form data in localStorage
                const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
                contacts.push({
                    name: name.value,
                    email: email.value,
                    subject: subject.value,
                    message: message.value,
                    date: new Date().toISOString()
                });
                localStorage.setItem('contacts', JSON.stringify(contacts));
                
                // Display success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Your message has been sent successfully!';
                successMessage.style.color = '#2ecc71';
                successMessage.style.marginTop = '20px';
                successMessage.style.fontWeight = 'bold';
                
                // Insert success message after form
                contactForm.appendChild(successMessage);
                
                // Reset form
                contactForm.reset();
                
                // Prevent actual form submission for this example
                e.preventDefault();
                
                // Log form data
                console.log('Contact form submitted with:', {
                    name: name.value,
                    email: email.value,
                    subject: subject.value,
                    message: message.value
                });
                
                // Remove success message after 3 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            }
        });
    }

    // Blog Post Search Functionality
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        // ============== ENHANCED FEATURE: Live Search ==============
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function() {
                const searchTerm = this.value.toLowerCase().trim();
                if (searchTerm.length > 2) {
                    filterPosts(searchTerm);
                } else if (searchTerm.length === 0) {
                    // Show all posts if search is cleared
                    resetSearch();
                }
            }, 300));
        }
        
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                alert('Please enter a search term');
                return;
            }
            
            filterPosts(searchTerm);
            
            // Save search history in localStorage
            const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            // Add only if not already in history
            if (!searchHistory.includes(searchTerm)) {
                searchHistory.unshift(searchTerm);
                // Keep only 10 most recent searches
                if (searchHistory.length > 10) {
                    searchHistory.pop();
                }
                localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            }
        });
    }

    // Function to filter posts based on search term
    function filterPosts(searchTerm) {
        // Get all blog posts
        const blogPosts = document.querySelectorAll('.post-card');
        let matchFound = false;
        
        // Filter posts based on search term
        blogPosts.forEach(post => {
            const postTitle = post.querySelector('h3').textContent.toLowerCase();
            const postContent = post.querySelector('p').textContent.toLowerCase();
            const postCategory = post.querySelector('.post-category')?.textContent.toLowerCase() || '';
            
            if (postTitle.includes(searchTerm) || 
                postContent.includes(searchTerm) || 
                postCategory.includes(searchTerm)) {
                post.style.display = 'block';
                // Highlight matching text (for titles and content)
                highlightText(post.querySelector('h3'), postTitle, searchTerm);
                highlightText(post.querySelector('p'), postContent, searchTerm);
                matchFound = true;
            } else {
                post.style.display = 'none';
            }
        });
        
        // Display message if no matches found
        const noResultsEl = document.getElementById('no-results');
        if (noResultsEl) {
            if (!matchFound) {
                noResultsEl.style.display = 'block';
                noResultsEl.textContent = `No results found for "${searchTerm}"`;
            } else {
                noResultsEl.style.display = 'none';
            }
        }
    }
    
    function resetSearch() {
        const blogPosts = document.querySelectorAll('.post-card');
        const noResultsEl = document.getElementById('no-results');
        
        blogPosts.forEach(post => {
            post.style.display = 'block';
            // Remove any highlighting
            const title = post.querySelector('h3');
            const content = post.querySelector('p');
            if (title) title.innerHTML = title.textContent;
            if (content) content.innerHTML = content.textContent;
        });
        
        if (noResultsEl) {
            noResultsEl.style.display = 'none';
        }
    }
    
    // Function to highlight matching text in elements
    function highlightText(element, text, searchTerm) {
        if (!element) return;
        
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const highlightedText = element.textContent.replace(
            regex, 
            '<span class="highlight">$1</span>'
        );
        
        element.innerHTML = highlightedText;
    }
    
    // Debounce function for search input
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ============== NEW FEATURE: Recent Search Display ==============
    const searchContainer = document.querySelector('.search-bar');
    if (searchContainer) {
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        
        if (searchHistory.length > 0) {
            const recentSearches = document.createElement('div');
            recentSearches.className = 'recent-searches';
            recentSearches.innerHTML = '<h4>Recent Searches</h4>';
            
            const searchTerms = document.createElement('div');
            searchTerms.className = 'search-terms';
            
            searchHistory.slice(0, 5).forEach(term => {
                const termEl = document.createElement('span');
                termEl.className = 'search-term';
                termEl.textContent = term;
                termEl.addEventListener('click', () => {
                    const searchInput = document.getElementById('search-input');
                    if (searchInput) {
                        searchInput.value = term;
                        filterPosts(term);
                    }
                });
                searchTerms.appendChild(termEl);
            });
            
            recentSearches.appendChild(searchTerms);
            
            const clearButton = document.createElement('button');
            clearButton.textContent = 'Clear History';
            clearButton.className = 'clear-history';
            clearButton.addEventListener('click', () => {
                localStorage.removeItem('searchHistory');
                recentSearches.remove();
            });
            
            recentSearches.appendChild(clearButton);
            searchContainer.appendChild(recentSearches);
        }
    }

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        // Check for saved dark mode preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
        
        darkModeToggle.addEventListener('change', () => {
            if (darkModeToggle.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', null);
            }
        });
    } else {
        // ============== NEW FEATURE: Auto Dark Mode Based on System Preference ==============
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        if (localStorage.getItem('darkMode') === null && prefersDarkScheme.matches) {
            document.body.classList.add('dark-mode');
        }
        
        prefersDarkScheme.addEventListener('change', (e) => {
            // Only change if user hasn't explicitly set a preference
            if (localStorage.getItem('darkMode') === null) {
                if (e.matches) {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
            }
        });
        
        // Add dark mode toggle button if it doesn't exist
        const header = document.querySelector('header .container');
        if (header && !document.getElementById('dark-mode-toggle')) {
            const darkModeButton = document.createElement('button');
            darkModeButton.id = 'dark-mode-btn';
            darkModeButton.innerHTML = '<i class="fas fa-moon"></i>';
            darkModeButton.title = 'Toggle Dark Mode';
            darkModeButton.className = 'dark-mode-btn';
            
            darkModeButton.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                
                if (document.body.classList.contains('dark-mode')) {
                    localStorage.setItem('darkMode', 'enabled');
                    darkModeButton.innerHTML = '<i class="fas fa-sun"></i>';
                } else {
                    localStorage.setItem('darkMode', null);
                    darkModeButton.innerHTML = '<i class="fas fa-moon"></i>';
                }
            });
            
            // Update button icon based on current mode
            if (document.body.classList.contains('dark-mode')) {
                darkModeButton.innerHTML = '<i class="fas fa-sun"></i>';
            }
            
            header.appendChild(darkModeButton);
        }
    }

    // Add animation to elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            } else {
                // Optional: Remove animation when scrolling back up
                // element.classList.remove('animate');
            }
        });
    };
    
    // Run animation check on page load and scroll
    if (document.querySelectorAll('.animate-on-scroll').length > 0) {
        animateOnScroll();
        window.addEventListener('scroll', animateOnScroll);
    }
    
    // ============== NEW FEATURE: Lazy Loading Images ==============
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
    
    // ============== NEW FEATURE: Scroll to Top Button ==============
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.id = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.title = 'Scroll to Top';
    scrollToTopBtn.className = 'scroll-to-top';
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    // Scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ============== NEW FEATURE: View/Read Tracking ==============
    // Track post views and reading progress
    const trackPostView = () => {
        // Check if we're on a post page
        const postContent = document.querySelector('.post-full-content');
        if (postContent) {
            const postId = window.location.pathname.split('/').pop().replace('.html', '');
            const postTitle = document.querySelector('.post-header h1')?.textContent || 'Unknown Post';
            
            // Save to localStorage
            const viewedPosts = JSON.parse(localStorage.getItem('viewedPosts') || '{}');
            viewedPosts[postId] = {
                title: postTitle,
                lastViewed: new Date().toISOString(),
                readingProgress: 0
            };
            localStorage.setItem('viewedPosts', JSON.stringify(viewedPosts));
            
            // Track reading progress
            window.addEventListener('scroll', () => {
                const windowHeight = window.innerHeight;
                const fullHeight = document.documentElement.scrollHeight;
                const scrolled = window.scrollY;
                
                // Calculate percentage read (0-100)
                const readPercentage = Math.min(
                    100, 
                    Math.round((scrolled / (fullHeight - windowHeight)) * 100)
                );
                
                // Update progress in localStorage
                const posts = JSON.parse(localStorage.getItem('viewedPosts') || '{}');
                if (posts[postId]) {
                    posts[postId].readingProgress = Math.max(
                        readPercentage, 
                        posts[postId].readingProgress || 0
                    );
                    localStorage.setItem('viewedPosts', JSON.stringify(posts));
                }
            });
        }
    };
    
    trackPostView();
    
    // ============== NEW FEATURE: Recently Viewed Posts ==============
    const addRecentlyViewedSection = () => {
        // Only show on blog pages
        const blogPosts = document.querySelector('.blog-posts');
        if (!blogPosts || window.location.pathname.includes('post')) return;
        
        const viewedPosts = JSON.parse(localStorage.getItem('viewedPosts') || '{}');
        const recentlyViewed = Object.entries(viewedPosts)
            .sort((a, b) => new Date(b[1].lastViewed) - new Date(a[1].lastViewed))
            .slice(0, 3);
        
        if (recentlyViewed.length > 0) {
            const recentSection = document.createElement('section');
            recentSection.className = 'recently-viewed';
            recentSection.innerHTML = `
                <div class="container">
                    <h2>Recently Viewed</h2>
                    <div class="recent-posts">
                        ${recentlyViewed.map(([id, post]) => `
                            <div class="recent-post">
                                <h3><a href="post${id}.html">${post.title}</a></h3>
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${post.readingProgress}%"></div>
                                </div>
                                <span class="progress-text">${post.readingProgress}% read</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            // Insert after blog-header section
            const blogHeader = document.querySelector('.blog-header');
            if (blogHeader) {
                blogHeader.after(recentSection);
            } else {
                blogPosts.before(recentSection);
            }
        }
    };
    
    addRecentlyViewedSection();
    
    // ============== NEW FEATURE: Table of Contents ==============
    const createTableOfContents = () => {
        // Only create TOC on individual post pages
        const postContent = document.querySelector('.post-full-content');
        if (!postContent) return;
        
        const headings = postContent.querySelectorAll('h2, h3, h4');
        if (headings.length < 3) return; // Only create TOC if there are enough headings
        
        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h3>Table of Contents</h3><ul></ul>';
        
        const tocList = toc.querySelector('ul');
        
        // Add IDs to headings if they don't have one
        headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = `heading-${index}`;
            }
            
            const listItem = document.createElement('li');
            listItem.className = `toc-${heading.tagName.toLowerCase()}`;
            
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
            
            listItem.appendChild(link);
            tocList.appendChild(listItem);
        });
        
        // Insert TOC at the beginning of the post content
        postContent.prepend(toc);
        
        // Optional: Add smooth scrolling to TOC links
        toc.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page jump
                    history.pushState(null, null, targetId);
                }
            });
        });
    };
    
    createTableOfContents();
    
    // ============== NEW FEATURE: Related Posts ==============
    const showRelatedPosts = () => {
        // Only show on individual post pages
        const postContent = document.querySelector('.post-full-content');
        if (!postContent) return;
        
        const currentPostCategory = document.querySelector('.post-category')?.textContent.toLowerCase();
        if (!currentPostCategory) return;
        
        // Fetch related posts (in a real app, this would be an API call)
        // This is a mock implementation using localStorage
        const viewedPosts = JSON.parse(localStorage.getItem('viewedPosts') || '{}');
        
        // For this example, we'll create mock related posts based on category
        const relatedPostsData = [
            {
                id: 1,
                title: 'AI Trends for Small Businesses',
                category: 'ai',
                excerpt: 'How small businesses can leverage AI technologies.',
                image: '/api/placeholder/400/300'
            },
            {
                id: 2,
                title: 'React vs Angular in 2025',
                category: 'web development',
                excerpt: 'Comparing the most popular frontend frameworks.',
                image: '/api/placeholder/400/300'
            },
            {
                id: 3,
                title: 'Cybersecurity Best Practices',
                category: 'security',
                excerpt: 'Keep your business safe with these security tips.',
                image: '/api/placeholder/400/300'
            },
            {
                id: 4,
                title: 'Serverless Architecture Benefits',
                category: 'cloud',
                excerpt: 'Why serverless is changing the cloud landscape.',
                image: '/api/placeholder/400/300'
            },
            {
                id: 5,
                title: 'Future of Mobile Development',
                category: 'mobile',
                excerpt: 'Where mobile app development is headed in 2025.',
                image: '/api/placeholder/400/300'
            }
        ];
        
        // Filter related posts by category
        const relatedPosts = relatedPostsData
            .filter(post => post.category === currentPostCategory)
            .slice(0, 3);
        
        if (relatedPosts.length > 0) {
            const relatedSection = document.createElement('div');
            relatedSection.className = 'related-posts';
            relatedSection.innerHTML = `
                <h3>Related Articles</h3>
                <div class="related-posts-grid">
                    ${relatedPosts.map(post => `
                        <article class="related-post">
                            <div class="related-post-image">
                                <img src="${post.image}" alt="${post.title}">
                            </div>
                            <div class="related-post-content">
                                <span class="post-category">${post.category}</span>
                                <h4><a href="post${post.id}.html">${post.title}</a></h4>
                                <p>${post.excerpt}</p>
                            </div>
                        </article>
                    `).join('')}
                </div>
            `;
            
            // Add related posts section after the main content
            const articleEnd = document.querySelector('.post-comments') || postContent;
            articleEnd.before(relatedSection);
        }
    };
    
    showRelatedPosts();
    
    // ============== NEW FEATURE: Share Buttons ==============
    const addShareButtons = () => {
        // Only add on individual post pages
        const postHeader = document.querySelector('.post-header');
        if (!postHeader) return;
        
        const shareButtons = document.createElement('div');
        shareButtons.className = 'share-buttons';
        shareButtons.innerHTML = `
            <h4>Share this article</h4>
            <div class="social-share">
                <button class="share-btn twitter" title="Share on Twitter">
                    <i class="fab fa-twitter"></i>
                </button>
                <button class="share-btn facebook" title="Share on Facebook">
                    <i class="fab fa-facebook-f"></i>
                </button>
                <button class="share-btn linkedin" title="Share on LinkedIn">
                    <i class="fab fa-linkedin-in"></i>
                </button>
                <button class="share-btn copy" title="Copy Link">
                    <i class="far fa-copy"></i>
                </button>
            </div>
        `;
        
        // Insert after post header
        postHeader.after(shareButtons);
        
        // Add click handlers for share buttons
        const pageTitle = document.title;
        const pageUrl = window.location.href;
        
        // Twitter share
        shareButtons.querySelector('.twitter').addEventListener('click', () => {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(pageUrl)}`, '_blank');
        });
        
        // Facebook share
        shareButtons.querySelector('.facebook').addEventListener('click', () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank');
        });
        
        // LinkedIn share
        shareButtons.querySelector('.linkedin').addEventListener('click', () => {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`, '_blank');
        });
        
        // Copy link
        shareButtons.querySelector('.copy').addEventListener('click', () => {
            navigator.clipboard.writeText(pageUrl).then(() => {
                alert('Link copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy link: ', err);
            });
        });
    };
    
    addShareButtons();
    
    // ============== NEW FEATURE: Comment Voting ==============
    const addCommentVoting = () => {
        const comments = document.querySelectorAll('.comment');
        
        comments.forEach(comment => {
            // Add voting buttons if they don't exist
            if (!comment.querySelector('.comment-voting')) {
                const votingContainer = document.createElement('div');
                votingContainer.className = 'comment-voting';
                votingContainer.innerHTML = `
                    <button class="upvote"><i class="fas fa-arrow-up"></i></button>
                    <span class="vote-count">0</span>
                    <button class="downvote"><i class="fas fa-arrow-down"></i></button>
                `;
                
                // Insert at the beginning of comment content
                const commentContent = comment.querySelector('.comment-content');
                if (commentContent) {
                    commentContent.prepend(votingContainer);
                }
                
                // Add event listeners for voting
                const upvoteBtn = votingContainer.querySelector('.upvote');
                const downvoteBtn = votingContainer.querySelector('.downvote');
                const voteCount = votingContainer.querySelector('.vote-count');
                
                upvoteBtn.addEventListener('click', () => {
                    // Check if already voted
                    if (upvoteBtn.classList.contains('active')) {
                        // Remove upvote
                        upvoteBtn.classList.remove('active');
                        voteCount.textContent = parseInt(voteCount.textContent) - 1;
                    } else {
                        // Add upvote
                        upvoteBtn.classList.add('active');
                        voteCount.textContent = parseInt(voteCount.textContent) + 1;
                        
                        // Remove downvote if exists
                        if (downvoteBtn.classList.contains('active')) {
                            downvoteBtn.classList.remove('active');
                            voteCount.textContent = parseInt(voteCount.textContent) + 1;
                        }
                    }
                });
                
                downvoteBtn.addEventListener('click', () => {
                    // Check if already voted
                    if (downvoteBtn.classList.contains('active')) {
                        // Remove downvote
                        downvoteBtn.classList.remove('active');
                        voteCount.textContent = parseInt(voteCount.textContent) + 1;
                    } else {
                        // Add downvote
                        downvoteBtn.classList.add('active');
                        voteCount.textContent = parseInt(voteCount.textContent) - 1;
                        
                        // Remove upvote if exists
                        if (upvoteBtn.classList.contains('active')) {
                            upvoteBtn.classList.remove('active');
                            voteCount.textContent = parseInt(voteCount.textContent) - 1;
                        }
                    }
                });
            }
        });
    }
    
    // Call the function when the DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        addCommentVoting();
    });

    // === THEME SWITCHER & DARK MODE ===
    function applyTheme(theme) {
        document.body.classList.remove('dark', 'dark-mode', 'sepia', 'contrast');
        if (theme && theme !== 'default') document.body.classList.add(theme);
        localStorage.setItem('theme', theme);
    }

    function setupThemeSwitcher() {
        let themeSwitcher = document.querySelector('.theme-switcher');
        if (!themeSwitcher) {
            const header = document.querySelector('header .container');
            themeSwitcher = document.createElement('div');
            themeSwitcher.className = 'theme-switcher';
            themeSwitcher.innerHTML = `
                <select id="theme-select">
                    <option value="default">Default</option>
                    <option value="dark">Dark</option>
                    <option value="sepia">Sepia</option>
                    <option value="contrast">High Contrast</option>
                </select>
            `;
            header && header.appendChild(themeSwitcher);
        }
        const select = themeSwitcher.querySelector('#theme-select');
        const savedTheme = localStorage.getItem('theme') || 'default';
        select.value = savedTheme;
        applyTheme(savedTheme);
        select.addEventListener('change', function() {
            applyTheme(this.value);
        });
    }
    setupThemeSwitcher();

    // Remove any other dark mode toggles/buttons/dropdowns
    const oldDarkBtn = document.getElementById('dark-mode-btn');
    if (oldDarkBtn) oldDarkBtn.remove();
    const oldDarkToggle = document.getElementById('dark-mode-toggle');
    if (oldDarkToggle) oldDarkToggle.remove();

    // === CATEGORY FILTER & PAGINATION ===
    const POSTS_PER_PAGE = 3;
    let currentPage = 1;
    let currentCategory = 'all';

    function getAllPosts() {
        return Array.from(document.querySelectorAll('.post-card'));
    }
    function getCategory(post) {
        return post.querySelector('.post-category').textContent.trim().toLowerCase();
    }
    function filterAndPaginatePosts() {
        const posts = getAllPosts();
        let filtered = posts;
        if (currentCategory !== 'all') {
            filtered = posts.filter(post => getCategory(post) === currentCategory);
        }
        posts.forEach(post => post.style.display = 'none');
        const start = (currentPage - 1) * POSTS_PER_PAGE;
        const end = start + POSTS_PER_PAGE;
        filtered.slice(start, end).forEach(post => post.style.display = 'block');
        updatePagination(filtered.length);
    }
    function updatePagination(totalFiltered) {
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;
        const totalPages = Math.ceil(totalFiltered / POSTS_PER_PAGE);
        let html = '';
        for (let i = 1; i <= totalPages; i++) {
            html += `<a href="#" class="${i === currentPage ? 'active' : ''}">${i}</a>`;
        }
        if (currentPage < totalPages) {
            html += `<a href="#" class="next"><i class="fas fa-angle-right"></i></a>`;
        }
        pagination.innerHTML = html;
        pagination.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', function(e) {
                e.preventDefault();
                if (this.classList.contains('next')) {
                    currentPage++;
                } else {
                    currentPage = parseInt(this.textContent);
                }
                filterAndPaginatePosts();
            });
        });
    }
    const categoryLinks = document.querySelectorAll('.category-filter a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.textContent.trim().toLowerCase();
            currentPage = 1;
            filterAndPaginatePosts();
        });
    });
    filterAndPaginatePosts();
});